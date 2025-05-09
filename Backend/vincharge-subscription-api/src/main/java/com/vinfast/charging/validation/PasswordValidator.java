package com.vinfast.charging.validation;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.util.regex.Pattern;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = PasswordValidator.PasswordValidatorImpl.class)
@Documented
public @interface PasswordValidator {

    String message() default "Password must be at least 6 characters and contain at least one uppercase letter, one number, and one special character from (@!#*&)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class PasswordValidatorImpl implements ConstraintValidator<PasswordValidator, String> {

        private static final Pattern PASSWORD_PATTERN = 
            Pattern.compile("^(?=.*[A-Z])(?=.*[0-9])(?=.*[@!#*&])(?=.*[a-zA-Z]).{6,}$");

        @Override
        public boolean isValid(String password, ConstraintValidatorContext context) {
            if (password == null) {
                return false;
            }
            return PASSWORD_PATTERN.matcher(password).matches();
        }
    }
}
