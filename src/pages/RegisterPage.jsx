import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import i18nCountries from "i18n-iso-countries";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { useTranslation } from "react-i18next";

import "./AuthForm.css";

// Register country languages
import en from "i18n-iso-countries/langs/en.json";
import ruCountries  from "i18n-iso-countries/langs/ru.json";

import enGB from "date-fns/locale/en-GB";
import ru from "date-fns/locale/ru";


const RegisterPage = ({ onSwitchToLogin }) => {
  const { t, i18n } = useTranslation();
  const selectedLanguage = i18n.language;
  const navigate = useNavigate();
  const formRef = useRef(null);
  

  // Initialize i18n countries
  i18nCountries.registerLocale(en);
  i18nCountries.registerLocale(ruCountries);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    country: "",
    university: "",
    department: "",
    profession: "",
    position: "",
    gender: "",
    agreePersonalData: false,
    acceptTerms: false,
  });

  const [countryOptions, setCountryOptions] = useState([]);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [confirmEmailError, setConfirmEmailError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (selectedLanguage === "ru") {
      registerLocale("ru", ru);
    } else {
      registerLocale("en-GB", enGB);
    }
  }, [selectedLanguage]);

  // Title options based on language
  const titleOptions =
    selectedLanguage === "ru"
      ? [
          { value: "Уважаемый", label: "Уважаемый" },
          { value: "Уважаемая", label: "Уважаемая" },
          { value: "Доктор.", label: "Доктор" },
          { value: "Профессор.", label: "Профессор" },
          { value: "Академик", label: "Академик" },
        ]
      : [
          { value: "Mr.", label: t("registerPage.mr") },
          { value: "Ms.", label: t("registerPage.ms") },
          { value: "Mrs.", label: t("registerPage.mrs") },
          { value: "Dr.", label: t("registerPage.dr") },
          { value: "Prof.", label: t("registerPage.prof") },
        ];


  const genderOptions = selectedLanguage === "ru"
        ? [
            { value: "Мужской", label: "Мужской" },
            { value: "Женский", label: "Женский" },
            { value: "Другое", label: "Другое" },
          ]
        : [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ];
      

  // Load country options
  useEffect(() => {
    const getCountries = () => {
      try {
        const countries = Object.entries(
          i18nCountries.getNames(selectedLanguage)
        ).map(([code, name]) => ({ value: code, label: name }));
        setCountryOptions(countries);
      } catch (error) {
        console.error("Error loading countries:", error);
        setCountryOptions([]);
      }
    };

    getCountries();
  }, [selectedLanguage]);

  // Form validation functions
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return regex.test(password);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    setEmailError(false);

    if (formData.confirmEmail) {
      setConfirmEmailError(value !== formData.confirmEmail);
    }
  };

  const handleConfirmEmailChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, confirmEmail: value });
    setConfirmEmailError(value !== formData.email);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });

    if (!validatePassword(value)) {
      setPasswordError(t("registerPage.passwordError"));
    } else {
      setPasswordError("");
    }

    if (formData.confirmPassword) {
      setConfirmPasswordError(
        value !== formData.confirmPassword
          ? t("registerPage.confirmPasswordError")
          : ""
      );
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, confirmPassword: value });
    setConfirmPasswordError(
      value !== formData.password ? t("registerPage.confirmPasswordError") : ""
    );
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (formData.email !== formData.confirmEmail) {
      setConfirmEmailError(true);
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setPasswordError(t("registerPage.passwordError"));
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError(t("registerPage.confirmPasswordError"));
      setIsLoading(false);
      return;
    }

    // Prepare payload
    const payload = {
      email: formData.email,
      password: formData.password,
      role: "user",
      dashboardLang: selectedLanguage,
      personalDetails: {
        title: formData.title,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        dob: formData.dob,
        phone: formData.phone,
        gender: formData.gender,
        country: formData.country,
        acceptTerms: formData.acceptTerms,
        agreePersonalData: formData.agreePersonalData,
      },
      professionalDetails: {
        university: formData.university,
        department: formData.department,
        profession: formData.profession,
        position: formData.position,
      },
    };

    try {
      const response = await fetch(`${baseUrl}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Email already registered.") {
          setEmailError(true);
          toast.error(t("registerPage.toastEmailRegistered"));
        } else {
          toast.error(t("registerPage.toastRegistrationFailed"));
        }
        return;
      }

      toast.success(t("registerPage.toastSuccess"));
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t("registerPage.toastErrorOccurred"));
    } finally {
      setIsLoading(false);
    }
  };


  const lang = i18n.language;

  const privacyPolicyUrl = "/privacy-policy"; // or t("registerPage.privacyPolicyUrl")
  const termsUrl = "/terms"; // or t("registerPage.termsUrl")


  const termsText =
  lang === "ru" ? (
    <>
      Я принимаю <a href={termsUrl} target="_blank" rel="noopener noreferrer">условия пользования</a> сервисами <strong>EAFO</strong>
    </>
  ) : (
    <>
      I accept the Terms & Conditions of <strong>EAFO</strong> in submitting this registration.{" "}
      <a href={termsUrl} target="_blank" rel="noopener noreferrer">
        Terms of Use
      </a>
    </>
  );

const personalDataText =
  lang === "ru" ? (
    <>
      Я даю согласие на обработку персональных данных и соглашаюсь с <a href={privacyPolicyUrl} target="_blank" rel="noopener noreferrer">политикой конфиденциальности EAFO</a>
    </>
  ) : (
    <>
      I grant permission to <strong>EAFO</strong> to use my personal data.{" "}
      <a href={privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
        Privacy Policy
      </a>
    </>
  );



  return (
    <form className="register-form" onSubmit={handleSubmit}>

<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 15000 }}
      />
      <h1>{t("registerPage.register")}</h1>

      {/* Title */}
      <div className="input-box">
        <select
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        >
          <option value="">{t("registerPage.selectTitle")}</option>
          {titleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Name Fields - order changes based on language */}
      {selectedLanguage === "ru" ? (
        <>
          <div className="input-box">
            <input
              type="text"
              placeholder={t("registerPage.lastName")}
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder={t("registerPage.firstName")}
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder={t("registerPage.middleName")}
              value={formData.middleName}
              onChange={(e) =>
                setFormData({ ...formData, middleName: e.target.value })
              }
            />
          </div>
        </>
      ) : (
        <>
          <div className="input-box">
            <input
              type="text"
              placeholder={t("registerPage.firstName")}
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder={t("registerPage.middleName")}
              value={formData.middleName}
              onChange={(e) =>
                setFormData({ ...formData, middleName: e.target.value })
              }
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder={t("registerPage.lastName")}
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
        </>
      )}

      {/* Date of Birth */}
      <div className="input-box date-picker-div">
        
        <DatePicker
          selected={formData.dob}
          onChange={(date) => setFormData({ ...formData, dob: date })}
          locale={selectedLanguage === "ru" ? "ru" : "en-GB"}
          dateFormat={selectedLanguage === "ru" ? "dd.MM.yyyy" : "yyyy-MM-dd"}
          placeholderText={t('registerPage.dob')}
          className="date-picker"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          maxDate={new Date()}
          required
        />
      </div>

      {/* Gender */}
      <div className="input-box">
      <select
  value={formData.gender}
  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
  required
>
  <option value="">{t("registerPage.genderSelect")}</option>
  {genderOptions.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>

      </div>

      {/* Email */}
      <div className="input-box">
        <input
          type="email"
          placeholder={t("registerPage.email")}
          value={formData.email}
          onChange={handleEmailChange}
          required
          className={emailError ? "error" : ""}
        />
        {emailError && (
          <div className="error-message">
            <AiOutlineInfoCircle /> {t("registerPage.emailError")}
          </div>
        )}
      </div>

      {/* Confirm Email */}
      <div className="input-box">
        <input
          type="email"
          placeholder={t("registerPage.confirmEmail")}
          value={formData.confirmEmail}
          onChange={handleConfirmEmailChange}
          required
          className={confirmEmailError ? "error" : ""}
        />
        {confirmEmailError && (
          <div className="error-message">
            <AiOutlineInfoCircle /> {t("registerPage.confirmEmailError")}
          </div>
        )}
      </div>

      {/* Password Field */}
      <div className="input-box">
        <div className="password-input">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder={t("registerPage.password")}
            value={formData.password}
            onChange={handlePasswordChange}
            required
            className={passwordError ? "error" : ""}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
        {passwordError && (
          <div className="password-error-container">
            <div className="error-message">
              <AiOutlineInfoCircle />
              <span>{passwordError}</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="input-box">
        <div className="password-input">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder={t("registerPage.confirmPassword")}
            value={formData.confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className={confirmPasswordError ? "error" : ""}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            {confirmPasswordVisible ? (
              <AiOutlineEyeInvisible />
            ) : (
              <AiOutlineEye />
            )}
          </button>
        </div>
        {confirmPasswordError && (
          <div className="password-error-container">
            <div className="error-message">
              <AiOutlineInfoCircle />
              <span>{confirmPasswordError}</span>
            </div>
          </div>
        )}
      </div>

      {/* Phone */}
      <div className="input-box">
        <PhoneInput
          country={"ru"}
          value={formData.phone}
          onChange={(phone) => setFormData({ ...formData, phone })}
          inputProps={{
            required: true,
          }}
        />
      </div>

      {/* Country */}
      <div className="input-box">
        <Select
          options={countryOptions}
          value={countryOptions.find((opt) => opt.value === formData.country)}
          onChange={(selected) =>
            setFormData({ ...formData, country: selected.value })
          }
          placeholder={t("registerPage.country")}
          isSearchable
        />
      </div>

      {/* University */}
      <div className="input-box">
        <input
          type="text"
          placeholder={t("registerPage.university")}
          value={formData.university}
          onChange={(e) =>
            setFormData({ ...formData, university: e.target.value })
          }
          required
        />
      </div>

      {/* Department */}
      <div className="input-box">
        <input
          type="text"
          placeholder={t("registerPage.department")}
          value={formData.department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          required
        />
      </div>

      {/* Profession */}
      <div className="input-box">
        <input
          type="text"
          placeholder={t("registerPage.profession")}
          value={formData.profession}
          onChange={(e) =>
            setFormData({ ...formData, profession: e.target.value })
          }
        />
      </div>

      {/* Position */}
      <div className="input-box">
        <input
          type="text"
          placeholder={t("registerPage.position")}
          value={formData.position}
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value })
          }
        />
      </div>

      {/* Checkboxes */}
      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={formData.agreePersonalData}
            onChange={(e) =>
              setFormData({ ...formData, agreePersonalData: e.target.checked })
            }
            required
          />
          <span>{personalDataText}</span>
        </label>
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) =>
              setFormData({ ...formData, acceptTerms: e.target.checked })
            }
            required
          />
          <span>{termsText}</span>
        </label>
      </div>




      {/* Submit Button */}
      <button type="submit" className="button" disabled={isLoading}>
        {isLoading ? t("registerPage.registering") : t("registerPage.register")}
      </button>
    </form>
  );
};

export default RegisterPage;
