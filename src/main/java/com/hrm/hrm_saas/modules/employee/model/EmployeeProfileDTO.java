package com.hrm.hrm_saas.modules.employee.model;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeProfileDTO {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String workEmail;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobileNumber;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Street is required")
    private String currentStreet;

    @NotBlank(message = "City is required")
    private String currentCity;

    @NotBlank(message = "State is required")
    private String currentState;

    @NotBlank(message = "Zip code is required")
    private String currentZip;

    @NotBlank(message = "Country is required")
    private String currentCountry;

    private String designation;
    private String department;
    private LocalDate dateOfJoining;
    private String photoUrl;

    private String identityProofUrl;
    private String educationCertUrl;
    private String employmentProofUrl;
    private List<String> otherDocUrl;
}