package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.RoleRepository;
import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.UserRequest;
import com.dungken.scientificresearch2024backend.entity.Notification;
import com.dungken.scientificresearch2024backend.entity.Permission;
import com.dungken.scientificresearch2024backend.entity.Role;
import com.dungken.scientificresearch2024backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {
    private BCryptPasswordEncoder passwordEncoder;

    private UserRepository userRepository;

    private MailServiceImpl mailService;

    private RoleRepository roleRepository;

    @Autowired
    public AccountService(BCryptPasswordEncoder passwordEncoder, UserRepository userRepository, MailServiceImpl mailService, RoleRepository roleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.roleRepository = roleRepository;
    }

    public ResponseEntity<?> addUser(UserRequest userRequest){
        // Kiểm tra tên đăng nhập đã tồn tại chưa?
        if(userRepository.existsByUsername(userRequest.getUsername())){
            return ResponseEntity.badRequest().body(new Notification("Username available."));
        }

        // Kiểm tra email đã tồn tại chưa?
        if(userRepository.existsByEmail(userRequest.getEmail())){
            return ResponseEntity.badRequest().body(new Notification("Email available."));
        }

        User savedUser = new User();
        // set info user
        savedUser.setUserId(userRequest.getUserId());
        savedUser.setUsername(userRequest.getUsername());
        savedUser.setEmail(userRequest.getEmail());
        savedUser.setGender(userRequest.isGender());
        savedUser.setAddress(userRequest.getAddress());
        savedUser.setLastname(userRequest.getLastname());
        savedUser.setFirstname(userRequest.getFirstname());
        savedUser.setPhoneNumber(userRequest.getPhoneNumber());
        savedUser.setAvatar(userRequest.getAvatar());
        // Mã hóa mật khẩu
        String encryptPassword = passwordEncoder.encode(userRequest.getPassword());
        savedUser.setPassword(encryptPassword);

        // Set thong tin kich hoat tai khoan user
        savedUser.setActive(false);
        savedUser.setActiveCode(generateActivationCode());

        // Set role cho user
        List<Role> roles = new ArrayList<>();
        for(Integer roleId : userRequest.getRoles()) {
            Role role = roleRepository.findById(roleId).orElse(null);
            if(role != null) {
                roles.add(role);
            }
        }
        savedUser.setRoles(roles);

        // Luu user xuong db
        userRepository.save(savedUser);
        // Gui mail kich hoat tai khoan nguoi dung
        sendActivationEmail(savedUser.getEmail(), savedUser.getActiveCode());

        return ResponseEntity.ok(savedUser);
    }

    public ResponseEntity<?> updateUser(UserRequest userRequest){
        System.out.println(userRequest.getUserId());
        User user = userRepository.findByUserId(userRequest.getUserId());

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setUserId(userRequest.getUserId());
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setGender(userRequest.isGender());
        user.setAddress(userRequest.getAddress());
        user.setLastname(userRequest.getLastname());
        user.setFirstname(userRequest.getFirstname());
        user.setPhoneNumber(userRequest.getPhoneNumber());
        user.setAvatar(userRequest.getAvatar());


        List<Role> roles = new ArrayList<>();
        for(Integer roleId : userRequest.getRoles()) {
            Role role = roleRepository.findById(roleId).orElse(null);
            if(role != null) {
                roles.add(role);
            }
        }

        user.setRoles(roles);

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

//    public ResponseEntity<?> registerUser(User user){
//        // Kiểm tra tên đăng nhập đã tồn tại chưa?
//        if(userRepository.existsByUsername(user.getUsername())){
//            return ResponseEntity.badRequest().body(new Notification("Username available."));
//        }
//
//        // Kiểm tra email đã tồn tại chưa?
//        if(userRepository.existsByEmail(user.getEmail())){
//            return ResponseEntity.badRequest().body(new Notification("Email available."));
//        }
//
//        // Mã hóa mật khẩu
//        String encryptPassword = passwordEncoder.encode(user.getPassword());
//        user.setPassword(encryptPassword);
//
//        // Set thong tin kich hoat tai khoan user
//        user.setActive(false);
//        user.setActiveCode(generateActivationCode());
//
//        List<Role> roles = new ArrayList<>();
//        Role role = new Role();
//        role.setRoleName("USER");
//        roles.add(role);
//        user.setRoles(roles);
//
//        // Lưu người dùng người dùng vào DB
//        userRepository.save(user);
//
//        // Gui mail kich hoat tai khoan nguoi dung
//        sendActivationEmail(user.getEmail(), user.getActiveCode());
//
//        return ResponseEntity.ok("Sign Up Success");
//    }

    public ResponseEntity<?> updateUser(User user){
        User userUpdate = userRepository.findByUserId(user.getUserId());
        if(userUpdate == null) {
            return ResponseEntity.badRequest().body(new Notification("User khong ton tai!"));
        }
        // Kiểm tra tên đăng nhập, email co ton tai hay khong?
        if(userRepository.existsByUsername(userUpdate.getUsername()) && userRepository.existsByEmail(userUpdate.getEmail())){
            Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());

            userUpdate.setUsername(user.getUsername());
            userUpdate.setEmail(user.getEmail());
            userUpdate.setFirstname(user.getFirstname());
            userUpdate.setLastname(user.getLastname());
            userUpdate.setGender(user.isGender());
            userUpdate.setAddress(user.getAddress());
            userUpdate.setAvatar(user.getAvatar());
            userUpdate.setPhoneNumber(user.getPhoneNumber());
            userUpdate.setUpdatedAt(currentTimestamp);


            // Cap nhat nguoi dung vao DB
            userRepository.saveAndFlush(userUpdate);

            return ResponseEntity.ok("Update Success");
        } else {
            return ResponseEntity.badRequest().body(new Notification("Username or email unavailable."));
        }
    }



    private String generateActivationCode(){
        // Tạo mã ngẫu nhiên
        return UUID.randomUUID().toString();
    }

    private void sendActivationEmail(String email, String activeCode){
        String subject = "Kích hoạt tài khoản của bạn tại Website hỗ trợ học toán rời rạc";
        String text = "Vui lòng sử dụng mã sau để kich hoạt cho tài khoản <"+email+">:" +
                "<html><body><br/><h1>"+activeCode+"</h1></body></html>";
        text+="<br/> Click vào đường link để kích hoạt tài khoản: ";
        String url = "http://dungken.pro.vn/active/"+email+"/"+activeCode;
        text+=("<br/> <a href="+url+">"+url+"</a> ");

        mailService.sendMail("phpmaster.dungken.dev@gmail.com", email, subject, text);
    }
    public ResponseEntity<?> activeAccount(String email, String activeCode) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.badRequest().body(new Notification("User does not exist!"));
        }

        if (user.isActive()) {
            return ResponseEntity.badRequest().body(new Notification("Account has been activated!"));
        }

        if (activeCode.equals(user.getActiveCode())) {
            user.setActive(true);
            userRepository.save(user);
            return ResponseEntity.ok("Account activation successful!");
        } else {
            return ResponseEntity.badRequest().body(new Notification("Activation code is incorrect!"));
        }
    }

    public ResponseEntity<?> resetPassUser(User user){
        // Kiểm tra email có tồn tại trong hệ thống không?
        if(!userRepository.existsByEmail(user.getEmail())){
            return ResponseEntity.badRequest().body(new Notification("Email unavailable."));
        }

        // Lấy người dùng từ cơ sở dữ liệu
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            return ResponseEntity.badRequest().body(new Notification("User not found"));
        }

        // Set thong tin kich hoat tai khoan user
        existingUser.setActive(false);
        existingUser.setActiveCode(generateActivationCode());

        // Cập nhật người dùng trong DB
        userRepository.save(existingUser);

        // Gui mail xác nhận người dùng biết là chính xác lấy lại mật khẩu
        sendMailResetPassword(existingUser.getEmail(), existingUser.getActiveCode());

        return ResponseEntity.ok("Sent authentication successfully!");
    }

    private void sendMailResetPassword(String email, String activeCode){
        String subject = "Yêu cầu lấy lại mật khẩu của bạn tại Website hỗ trợ học toán rời rạc";
        String text ="Click vào đường link để lấy lại mật khẩu: ";
        String url = "http://dungken.pro.vn/reset-pass/"+email+"/"+activeCode;
        text+=("<br/> <a href="+url+">"+url+"</a> ");

        mailService.sendMail("phpmaster.dungken.dev@gmail.com", email, subject, text);
    }

    public ResponseEntity<?> resetPasswordAccount(String email, String activeCode) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.badRequest().body(new Notification("User does not exist!"));
        }

        if (user.isActive()) {
            return ResponseEntity.badRequest().body(new Notification("Account has been activated!"));
        }

        if (activeCode.equals(user.getActiveCode())) {
            user.setActive(true);
            userRepository.save(user);
            return ResponseEntity.ok("Password recovery successful!");
        } else {
            return ResponseEntity.badRequest().body(new Notification("Activation code is incorrect!"));
        }
    }

    public ResponseEntity<?> updatePassword(User user) {
        User userExisting = userRepository.findByEmail(user.getEmail());

        if (user == null) {
            return ResponseEntity.badRequest().body(new Notification("User does not exist!"));
        }

        // Mã hóa mật khẩu
        String encryptPassword = passwordEncoder.encode(user.getPassword());
        userExisting.setPassword(encryptPassword);

        userRepository.save(userExisting);
        return ResponseEntity.ok("Password recovery successful!");
    }


}
