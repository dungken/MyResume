import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { InputField, SelectField } from '../../utils/Controls';
import { GetInforAddress } from '../../utils/GetInforAddress';
import { GetPersonalInfoService, UpdatePersonalInfoService } from '../../services/UserService';
import { toast } from 'react-toastify';
import { ValidatePhoneNumber } from '../../utils/Validation';


const AccountInfo: React.FC = () => {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [fullAddress, setFullAddress] = useState('');

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [communes, setCommunes] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');

    // Fetch personal information when component mounts
    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const response: any = await GetPersonalInfoService();
                // console.log(response);

                if (response.success === true) {
                    const userData = response.data.user;

                    setUserId(userData.id);
                    setUsername(userData.userName);
                    setLastName(userData.lastName);
                    setFirstName(userData.firstName);
                    setEmail(userData.email);
                    setPhoneNumber(userData.phoneNumber);
                    setGender(userData.gender);
                    setDateOfBirth(userData.dateOfBirth.split('T')[0]);
                    setFullAddress(userData.fullAddress);
                    setSelectedProvince(userData.provinceCode);
                    setSelectedDistrict(userData.districtCode);
                    setSelectedCommune(userData.communeCode);
                } else {
                    console.error('Failed to retrieve personal info:', response.Message);
                }
            } catch (error) {
                console.error('Error fetching personal info:', error);
            }
        };

        fetchPersonalInfo();
    }, []);

    useEffect(() => {
        GetInforAddress('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1', setProvinces);
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            GetInforAddress(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${selectedProvince}&limit=-1`, setDistricts);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            GetInforAddress(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${selectedDistrict}&limit=-1`, setCommunes);
        }
    }, [selectedDistrict]);
    // console.log(communes);

    const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProvince(event.target.value);
        setDistricts([]);
        setCommunes([]);
    };

    const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDistrict(event.target.value);
        setCommunes([]);
    };

    console.log(selectedProvince, selectedDistrict, selectedCommune);


    const validateForm = async (user: { [key: string]: any }) => {
        // console.log(user.lastName, user.firstName, user.username);
        console.log(user);

        if (lastName.length < 2) {
            toast.error('Last name must be at least 2 characters long.');
            return false;
        }
        if (firstName.length < 2) {
            toast.error('First name must be at least 2 characters long.');
            return false;
        }
        if (phoneNumber != null && !ValidatePhoneNumber(phoneNumber)) {
            toast.error('Please enter a valid Vietnamese phone number (10 digits starting with 03, 05, 07, 08, 09).');
            return false;
        }

        return true;
    };


    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validation Form
        const user = {
            // username: username,
            lastName: lastName,
            firstName: firstName,
            phoneNumber: phoneNumber,
            gender: gender,
            // email: email,
            dateOfBirth: dateOfBirth,
            provinceCode: selectedProvince,
            districtCode: selectedDistrict,
            communeCode: selectedCommune,
            fullAddress: fullAddress,
        };

        const isValid = await validateForm(user);
        if (!isValid) return;

        try {
            console.log(user);

            const response = await UpdatePersonalInfoService(user);
            console.log(response);

            if (response.success === true) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to update personal information.');
        };
    };

    return (
        <div className="account-info my-3">
            <h2>Thông tin tài khoản</h2>
            <Form method="POST" onSubmit={handleSaveChanges}>
                <InputField label="User ID" id="userId" name="userId" value={userId} disabled />
                <InputField label="Email" id="email" name='email' value={email} disabled />
                <InputField label="Username" id="username" name='username' value={username} disabled />
                <InputField label="Role" id="role" name='role' value={'User'} disabled />
                <InputField label="First Name" id="firstName" name='firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <InputField label="Last Name" id="lastName" name='lastName' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <InputField label="Phone Number" name='phoneNumber' id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                <SelectField
                    label="Gender"
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Other', label: 'Other' }
                    ]}
                />
                <InputField label="Date of Birth" name='dateOfBirth' id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                <SelectField
                    label="Province"
                    id="province"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    options={provinces.map(province => ({ value: province.code, label: province.name }))}
                />
                <SelectField
                    label="District"
                    id="district"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    options={districts.map(district => ({ value: district.code, label: district.name_with_type }))}
                />
                <SelectField
                    label="Commune"
                    id="commune"
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    options={communes.map(commune => ({ value: commune.code, label: commune.name_with_type }))}
                />
                <InputField label="Full Address" name='fullAddress' id="fullAddress" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} />

                <div className="my-3">
                    <button type="submit" className="btn btn-primary me-3">Save changes</button>
                    <button type="reset" className="btn btn-outline-secondary">Cancel</button>
                </div>
            </Form>
        </div>
    );
};

export default AccountInfo;
