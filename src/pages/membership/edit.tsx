import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Card,
  Breadcrumb,
  Image,
  Upload,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import { UploadOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { useFieldArray, useForm } from "react-hook-form";
import { useForm as useRefineForm } from "@refinedev/antd";
import { customDataProvider } from "../../providers/customDataProvider";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate for redirection
import { useDocumentTitle } from "@refinedev/react-router";

// Utility for combining class names
const cn = (...classes: string[]): string => classes.filter(Boolean).join(" ");

const { Option } = Select;

interface StepFormProps {}

interface Education {
  name: string;
  institution: string;
  award: string;
  course: string;
  year: string;
}

interface FormData {
  education: {
    highest: string;
    degrees: Education[];
  };
}

export const EditMembership: React.FC<StepFormProps> = () => {
  const navigate = useNavigate(); // Initialize navigation function
  const [currentStep, setCurrentStep] = useState(1);
  const { id: membershipId } = useParams();
  const [formData, setFormData] = useState<any>();
  const [form] = Form.useForm();
  useDocumentTitle("Edit | CIPMN CRM");

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMembership = async () => {
      if (!membershipId) return; // Ensure there's an ID to fetch

      setLoading(true);
      try {
        const response: any = await customDataProvider.getOne({
          resource: "membership",
          id: membershipId, // Fetch specific record by ID
        });

        if (response) {
          setFormData((prev: any) => ({
            ...prev,
            ...response,

            // Convert date fields to dayjs
            dob: response.dob ? dayjs(response.dob) : "",
            yearOfLicense: response.yearOfLicense
              ? dayjs(response.yearOfLicense)
              : "",

            // Parse JSON fields
            countryOfOrigin: JSON.parse(response.countryOfOrigin || "{}"),
            countryOfResidence: JSON.parse(response.countryOfResidence || "{}"),
            countryOfOperation: JSON.parse(response.countryOfOperation || "{}"),

            educationQualification: {
              degrees: JSON.parse(
                response.educationQualification || '{"degrees":[]}'
              ).degrees.map((degree: any) => ({
                ...degree,
                year: degree.year ? dayjs(degree.year) : "", // Convert year to dayjs
              })),
            },

            professionalQualification: JSON.parse(
              response.professionalQualification || "[]"
            ),

            workExperience: JSON.parse(response.workExperience || "[]").map(
              (exp: any) => ({
                ...exp,
                year: exp.year ? dayjs(exp.year) : "", // Convert workExperience.year to dayjs
              })
            ),

            references: JSON.parse(response.references || "[]"),
          }));
        }
      } catch (error) {
        console.error("Error fetching membership data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [membershipId]); // Re-fetch when the ID changes

  const handleNext = async () => {
    const values = await form.validateFields();
    setFormData((prev: any) => ({ ...prev, ...values }));
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();

      const payload = {
        ...formData,
        ...values,
        countryOfOrigin: JSON.stringify(formData.countryOfOrigin),
        countryOfResidence: JSON.stringify(formData.countryOfResidence),
        countryOfOperation: JSON.stringify(formData.countryOfOperation),
        educationQualification: JSON.stringify(formData.educationQualification),
        professionalQualification: JSON.stringify(
          formData.professionalQualification
        ),
        workExperience: JSON.stringify(formData.workExperience),
        references: JSON.stringify(formData.references) || "[]",
      };

      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.userId;
      const membershipResponse = await customDataProvider.update({
        resource: "membership", // API resource name for membership
        id: formData.id,
        variables: payload, // Ensure correct payload format
      });

      navigate("/membership"); // Redirect user
    } catch (error) {
      console.error("Submission Failed:", error);
      alert("Submission failed. Please try again.");
    }
  };

  const membershipCategory = [
    "Student",
    "Graduate",
    "Associate",
    "Chartered",
    "Fellowship",
    "Honorary Fellowship",
  ];

  const countryList = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini (Swaziland)",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts & Nevis",
    "Saint Lucia",
    "Saint Vincent & Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome & Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad & Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const titles = ["Engr", "Arc", "Bldr", "Qs", "Dr", "Mr", "Ms", "Mrs"];
  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
  const nigeriaZones = [
    "North Central",
    "North East",
    "North West",
    "South East",
    "South South",
    "South West",
  ];
  const operationalSectors = ["Public", "Private", "Others"];
  const highestEducations = ["PhD", "MSc", "BSc", "HND", "OND"];
  const nigeriaStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "Federal Capital Territory",
  ];

  const lgas: any = {
    Abia: [
      "Aba North",
      "Aba South",
      "Arochukwu",
      "Bende",
      "Ikwuano",
      "Isiala Ngwa North",
      "Isiala Ngwa South",
      "Isukwuato",
      "Kayru",
      "Obi Ngwa",
      "Ohafia",
      "Osisioma Ngwa",
      "Ugwunagbo",
      "Ukwa East",
      "Ukwa West",
      "Umuahia North",
      "Umuahia South",
    ],
    Adamawa: [
      "Demsa",
      "Fufore",
      "Ganye",
      "Girei",
      "Gombi",
      "Guyuk",
      "Hong",
      "Jada",
      "Lamurde",
      "Madagali",
      "Maiha",
      "Mayo Belwa",
      "Michika",
      "Mubi North",
      "Mubi South",
      "Numan",
      "Shelleng",
      "Song",
      "Toungo",
      "Yola North",
      "Yola South",
    ],
    "Akwa Ibom": [
      "Abak",
      "Eastern Obolo",
      "Eket",
      "Esit Eket",
      "Essien Udim",
      "Etim Ekpo",
      "Etinan",
      "Ibeno",
      "Ibesikpo Asutan",
      "Ibiono Ibom",
      "Ika",
      "Ikono",
      "Ikot Abasi",
      "Ikot Ekpene",
      "Ini",
      "Mkpat Enin",
      "Nsit Atai",
      "Nsit Ibom",
      "Obot Akara",
      "Okobo",
      "Onna",
      "Oron",
      "Oruk Anam",
      "Udung Uko",
      "Uruan",
      "Urue Offong Oruko",
      "Uyo",
    ],
    Anambra: [
      "Aguata",
      "Anambra East",
      "Anambra West",
      "Anaocha",
      "Awka North",
      "Awka South",
      "Ayamelum",
      "Dunukofia",
      "Ekwusigo",
      "Erokwu",
      "Idemili North",
      "Idemili South",
      "Ihiala",
      "Imo Awka",
      "Njikoka",
      "Nnewi North",
      "Nnewi South",
      "Ogbaru",
      "Onitsha North",
      "Onitsha South",
      "Orumba North",
      "Orumba South",
      "Oyi",
    ],
    Bauchi: [
      "Alkaleri",
      "Bauchi",
      "Bogoro",
      "Dambam",
      "Darazo",
      "Dukku",
      "Ganjuwa",
      "Giade",
      "Itas/Gadau",
      "Jama'are",
      "Katagum",
      "Kirfi",
      "Misau",
      "Ningi",
      "Shira",
      "Tafawa Balewa",
      "Toro",
      "Warji",
      "Zaki",
    ],
    Bayelsa: [
      "Brass",
      "Ekeremor",
      "Kolokuma/Opokuma",
      "Nembe",
      "Ogbia",
      "Sagbama",
      "Southern Ijaw",
      "Yenagoa",
    ],
    Benue: [
      "Agatu",
      "Apa",
      "Ado",
      "Buruku",
      "Gboko",
      "Guma",
      "Gwer East",
      "Gwer West",
      "Katsina-Ala",
      "Konshisha",
      "Kwande",
      "Logo",
      "Makurdi",
      "Obi",
      "Ogbadibo",
      "Ohimini",
      "Oju",
      "Okpokwu",
      "Otukpo",
      "Tarka",
      "Ukum",
      "Ushongo",
      "Vandeikya",
    ],
    Borno: [
      "Abadam",
      "Askira/Uba",
      "Bama",
      "Bayo",
      "Biu",
      "Chibok",
      "Dikwa",
      "Gubio",
      "Guzamala",
      "Gwoza",
      "Hawul",
      "Jere",
      "Kaga",
      "Kala/Balge",
      "Konduga",
      "Kukawa",
      "Kwaya Kusar",
      "Mafa",
      "Magumeri",
      "Maiduguri",
      "Marte",
      "Mobbar",
      "Monguno",
      "Ngala",
      "Nganzai",
      "Shani",
    ],
    "Cross River": [
      "Abi",
      "Akamkpa",
      "Akpabuyo",
      "Bakassi",
      "Bekwarra",
      "Biase",
      "Boki",
      "Calabar Municipal",
      "Calabar South",
      "Etung",
      "Ikom",
      "Obanliku",
      "Obubra",
      "Odukpani",
      "Ogoja",
      "Yakuur",
      "Yala",
    ],
    Delta: [
      "Aniocha North",
      "Aniocha South",
      "Bomadi",
      "Burutu",
      "Ethiope East",
      "Ethiope West",
      "Ika North East",
      "Ika South",
      "Isoko North",
      "Isoko South",
      "Ndokwa East",
      "Ndokwa West",
      "Okpe",
      "Oshimili North",
      "Oshimili South",
      "Patani",
      "Sapele",
      "Udu",
      "Ughelli North",
      "Ughelli South",
      "Ukwuani",
      "Uvwie",
      "Warri North",
      "Warri South",
      "Warri South West",
    ],
    Ebonyi: [
      "Abakaliki",
      "Afikpo North",
      "Afikpo South",
      "Ebonyi",
      "Ezza North",
      "Ezza South",
      "Ikwo",
      "Ishielu",
      "Ivo",
      "Izzi",
      "Ohaozara",
      "Ohaukwu",
      "Onicha",
    ],
    Edo: [
      "Akoko-Edo",
      "Egor",
      "Esan Central",
      "Esan North East",
      "Esan South East",
      "Esan West",
      "Etsako Central",
      "Etsako East",
      "Etsako West",
      "Igueben",
      "Ikpoba Okha",
      "Orhionmwon",
      "Oredo",
      "Ovia North East",
      "Ovia South West",
      "Owan East",
      "Owan West",
      "Uhunmwonde",
    ],
    Ekiti: [
      "Ado Ekiti",
      "Ikere",
      "Emure",
      "Efon",
      "Ekiti East",
      "Ekiti West",
      "Ijero",
      "Ido Osi",
      "Ilejemeje",
      "Irepodun/Ifelodun",
      "Ise/Orun",
      "Moba",
      "Oye",
    ],
    Enugu: [
      "Aninri",
      "Awgu",
      "Enugu East",
      "Enugu North",
      "Enugu South",
      "Ezeagu",
      "Igbo Etiti",
      "Igbo Eze North",
      "Igbo Eze South",
      "Isi Uzo",
      "Nkanu East",
      "Nkanu West",
      "Nsukka",
      "Oji River",
      "Udenu",
      "Udi",
      "Uzo Uwani",
    ],
    Gombe: [
      "Akko",
      "Balanga",
      "Billiri",
      "Dukku",
      "Funakaye",
      "Gombe",
      "Kaltungo",
      "Kwami",
      "Nafada",
      "Shongom",
      "Yamaltu/Deba",
    ],
    Imo: [
      "Aboh Mbaise",
      "Ahiazu Mbaise",
      "Ehime Mbano",
      "Ezinihitte Mbaise",
      "Ideato North",
      "Ideato South",
      "Ihitte/Uboma",
      "Ikeduru",
      "Isiala Mbano",
      "Isu",
      "Mbaitoli",
      "Ngor Okpala",
      "Njaba",
      "Nkwerre",
      "Nwangele",
      "Obowo",
      "Oguta",
      "Ohaji/Egbema",
      "Oru East",
      "Oru West",
      "Orsu",
      "Owerri Municipal",
      "Owerri North",
      "Owerri West",
      "Unuimo",
    ],
    Jigawa: [
      "Auyo",
      "Babura",
      "Biriniwa",
      "Buji",
      "Dutse",
      "Gagarawa",
      "Garki",
      "Gumel",
      "Guri",
      "Gwaram",
      "Gwiwa",
      "Hadejia",
      "Jahun",
      "Kafin Hausa",
      "Kazaure",
      "Kiri Kasama",
      "Kiyawa",
      "Kaugama",
      "Maigatari",
      "Malam Madori",
      "Miga",
      "Ringim",
      "Roni",
      "Sule Tankarkar",
      "Taura",
      "Yankwashi",
    ],
    Kaduna: [
      "Birnin Gwari",
      "Chikun",
      "Giwa",
      "Igabi",
      "Ikara",
      "Jaba",
      "Jema'a",
      "Kachia",
      "Kaduna North",
      "Kaduna South",
      "Kagarko",
      "Kajuru",
      "Kaura",
      "Kauru",
      "Kubau",
      "Kudan",
      "Lere",
      "Makarfi",
      "Sabon Gari",
      "Sanga",
      "Soba",
      "Zangon Kataf",
      "Zaria",
    ],
    Kano: [
      "Ajingi",
      "Albasu",
      "Bagwai",
      "Bebeji",
      "Bichi",
      "Bunkure",
      "Dala",
      "Danbatta",
      "Dawakin Kudu",
      "Dawakin Tofa",
      "Doguwa",
      "Fagge",
      "Gabasawa",
      "Garko",
      "Garun Mallam",
      "Gaya",
      "Gezawa",
      "Gwale",
      "Gwarzo",
      "Kabo",
      "Kano Municipal",
      "Karaye",
      "Kibiya",
      "Kiru",
      "Kumbotso",
      "Kunchi",
      "Kura",
      "Madobi",
      "Makoda",
      "Minjibir",
      "Nasarawa",
      "Rano",
      "Rimin Gado",
      "Rogo",
      "Shanono",
      "Sumaila",
      "Takai",
      "Tarauni",
      "Tofa",
      "Tsanyawa",
      "Tudun Wada",
      "Ungogo",
      "Warawa",
      "Wudil",
    ],
    Katsina: [
      "Bakori",
      "Batagarawa",
      "Batsari",
      "Baure",
      "Bindawa",
      "Dandume",
      "Danja",
      "Dan Musa",
      "Daura",
      "Dutsi",
      "Dutsin Ma",
      "Faskari",
      "Funtua",
      "Ingawa",
      "Jibia",
      "Kafur",
      "Kaita",
      "Kankara",
      "Kankia",
      "Karfiya",
      "Katsina",
      "Kurfi",
      "Kusada",
      "Mai'adua",
      "Malumfashi",
      "Mani",
      "Mashi",
      "Matazuu",
      "Musawa",
      "Rimi",
      "Sabuwa",
      "Safana",
      "Sandamu",
      "Zango",
    ],
    Kebbi: [
      "Aleiro",
      "Arewa Dandi",
      "Argungu",
      "Augie",
      "Bagudo",
      "Birnin Kebbi",
      "Bunza",
      "Dandi",
      "Fakai",
      "Gwandu",
      "Jega",
      "Kalgo",
      "Koko/Besse",
      "Maiyama",
      "Ngaski",
      "Sakaba",
      "Shanga",
      "Suru",
      "Wasagu/Danko",
      "Yauri",
      "Zuru",
    ],
    Kogi: [
      "Adavi",
      "Ajaokuta",
      "Ankpa",
      "Bassa",
      "Dekina",
      "Ibaji",
      "Idah",
      "Igalamela Odolu",
      "Ijumu",
      "Kabba/Bunnu",
      "Lokoja",
      "Mopa Muro",
      "Ofu",
      "Ogori/Magongo",
      "Okehi",
      "Okene",
      "Olamaboro",
      "Omala",
      "Yagba East",
      "Yagba West",
    ],
    Kwara: [
      "Asa",
      "Baruten",
      "Edu",
      "Ilorin East",
      "Ilorin South",
      "Ilorin West",
      "Isin",
      "Kaiama",
      "Moro",
      "Offa",
      "Oke Ero",
      "Oyun",
      "Pategi",
    ],
    Lagos: [
      "Agege",
      "Ajeromi-Ifelodun",
      "Alimosho",
      "Amuwo-Odofin",
      "Apapa",
      "Badagry",
      "Epe",
      "Eti Osa",
      "Ibeju-Lekki",
      "Ifako-Ijaiye",
      "Ikeja",
      "Ikorodu",
      "Kosofe",
      "Lagos Island",
      "Lagos Mainland",
      "Mushin",
      "Ojo",
      "Oshodi-Isolo",
      "Shomolu",
      "Surulere",
      "Yaba",
    ],
    Nasarawa: [
      "Akwanga",
      "Awe",
      "Doma",
      "Karu",
      "Keana",
      "Keffi",
      "Kokona",
      "Lafia",
      "Nasarawa",
      "Nasarawa Egon",
      "Obi",
      "Toto",
      "Wamba",
    ],
    Niger: [
      "Agaie",
      "Agwara",
      "Bida",
      "Borgu",
      "Bosso",
      "Chanchaga",
      "Edati",
      "Gbako",
      "Gurara",
      "Katcha",
      "Kontagora",
      "Lapai",
      "Lavun",
      "Magama",
      "Mariga",
      "Mashegu",
      "Mokwa",
      "Munya",
      "Pailoro",
      "Rafi",
      "Rijau",
      "Shiroro",
      "Suleja",
      "Tafa",
      "Wushishi",
    ],
    Ogun: [
      "Abeokuta North",
      "Abeokuta South",
      "Ado-Odo/Ota",
      "Egbado North",
      "Egbado South",
      "Ewekoro",
      "Ifo",
      "Ijebu East",
      "Ijebu North",
      "Ijebu North East",
      "Ijebu Ode",
      "Ikenne",
      "Imeko Afon",
      "Ipokia",
      "Obafemi Owode",
      "Odeda",
      "Odogbolu",
      "Remo North",
      "Sagamu",
      "Yewa North",
      "Yewa South",
    ],
    Ondo: [
      "Akoko North East",
      "Akoko North West",
      "Akoko South Akure East",
      "Akure North",
      "Akure West",
      "Ifedore",
      "Ilaje",
      "Ile Oluji/Okeigbo",
      "Irele",
      "Odigbo",
      "Okitipupa",
      "Ondo East",
      "Ondo West",
      "Ose",
      "Owo",
    ],
    Osun: [
      "Atakunmosa East",
      "Atakunmosa West",
      "Aiyedaade",
      "Aiyedire",
      "Boluwaduro",
      "Boripe",
      "Ede North",
      "Ede South",
      "Efon Alaye",
      "Egbedore",
      "Ejigbo",
      "Ifedayo",
      "Ifelodun",
      "Ila Orangun",
      "Ilesa East",
      "Ilesa West",
      "Irepodun",
      "Irewole",
      "Isokan",
      "Iwo",
      "Obokun",
      "Odo Otin",
      "Ola Oluwa",
      "Olorunda",
      "Oriade",
      "Orolu",
      "Osogbo",
    ],
    Oyo: [
      "Afijio",
      "Akinyele",
      "Atiba",
      "Atisbo",
      "Egbeda",
      "Ibadan North",
      "Ibadan North East",
      "Ibadan North West",
      "Ibadan South East",
      "Ibadan South West",
      "Ibarapa Central",
      "Ibarapa East",
      "Ibarapa North",
      "Ido",
      "Irepo",
      "Iseyin",
      "Itesiwaju",
      "Iwajowa",
      "Kajola",
      "Lagelu",
      "Ogbomosho North",
      "Ogbomosho South",
      "Ogo Oluwa",
      "Olorunsogo",
      "Oluyole",
      "Ona Ara",
      "Orelope",
      "Ori Ire",
      "Oyo East",
      "Oyo West",
      "Saki East",
      "Saki West",
    ],
    Plateau: [
      "Barkin Ladi",
      "Bassa",
      "Bokkos",
      "Jos East",
      "Jos North",
      "Jos South",
      "Kanam",
      "Kanke",
      "Langtang North",
      "Langtang South",
      "Mangu",
      "Mikang",
      "Pankshin",
      "Qua'an Pan",
      "Riyom",
      "Shendam",
      "Wase",
    ],
    Rivers: [
      "Abua/Odual",
      "Ahoada East",
      "Ahoada West",
      "Akuku-Toru",
      "Andoni",
      "Asari-Toru",
      "Bonny",
      "Degema",
      "Eleme",
      "Emuoha",
      "Etche",
      "Gokana",
      "Ikwerre",
      "Khana",
      "Obio/Akpor",
      "Ogba/Egbema/Ndoni",
      "Ogu/Bolo",
      "Okrika",
      "Omuma",
      "Opobo/Nkoro",
      "Oyigbo",
      "Port Harcourt",
      "Tai",
    ],
    Sokoto: [
      "Bodinga",
      "Dange Shuni",
      "Gada",
      "Goronyo",
      "Gudu",
      "Gwadabawa",
      "Illela",
      "Isa",
      "Kebbe",
      "Kware",
      "Rabah",
      "Sabon Birni",
      "Shagari",
      "Silame",
      "Sokoto North",
      "Sokoto South",
      "Tambuwal",
      "Tangaza",
      "Tureta",
      "Wamako",
      "Wurno",
      "Yabo",
    ],
    Taraba: [
      "Ardo Kola",
      "Bali",
      "Donga",
      "Gashaka",
      "Gassol",
      "Ibi",
      "Jalingo",
      "Karim Lamido",
      "Kurmi",
      "Lau",
      "Sardauna",
      "Takum",
      "Ussa",
      "Wukari",
      "Yorro",
      "Zing",
    ],
    Yobe: [
      "Bade",
      "Bursari",
      "Damaturu",
      "Fika",
      "Fune",
      "Geidam",
      "Gujba",
      "Gulani",
      "Jakusko",
      "Karasuwa",
      "Machina",
      "Nguru",
      "Potiskum",
      "Tarmuwa",
      "Yunusari",
      "Yusufari",
    ],
    Zamfara: [
      "Anka",
      "Bakura",
      "Birnin Magaji/Kiyaw",
      "Bukkuyum",
      "Bungudu",
      "Gummi",
      "Gusau",
      "Kaura Namoda",
      "Maradun",
      "Maru",
      "Shinkafi",
      "Talata Mafara",
      "Tsafe",
      "Zurmi",
    ],
    "Federal Capital Territory": [
      "Abaji",
      "Bwari",
      "Gwagwalada",
      "Kuje",
      "Municipal Area Council",
      "Abuja",
    ],
  };

  const [selectedState, setSelectedState] = useState<any>("");

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    form.setFieldsValue({ "location.lga": undefined }); // Reset LGA when state changes
  };

  const inputStyle = {
    height: "32px",
  };

  // Primary Button Style
  const buttonStyle = {
    backgroundColor: "#1F5E29",
    borderColor: "#1F5E29",
    color: "white",
    fontSize: "12px",
    height: "32px",
    padding: "0 16px",
  };

  // Secondary Outline Button Style (No Background)
  const outlineButtonStyle = {
    backgroundColor: "transparent",
    borderColor: "#1F5E29",
    color: "#1F5E29",
    fontSize: "12px",
    height: "26px",
    padding: "0 16px",
  };

  // Remove Button Style (Red Outline)
  const deleteButtonStyle = {
    backgroundColor: "transparent",
    borderColor: "#D9534F",
    color: "#D9534F",
    fontSize: "12px",
    height: "26px",
    padding: "0 8px",
  };

  const buttonHoverStyle = {
    backgroundColor: "#174a21",
    borderColor: "#174a21",
  };

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]); // Correct fileList management
  const [showPicture, setShowPicture] = useState<boolean>(false);

  useEffect(() => {
    // Merge existing values instead of overwriting
    form.setFieldsValue({
      ...form.getFieldsValue(), // Get existing form values
      ...formData,
    });
  }, [form, formData]);

  // Handle image selection and preview
  const handleImageChange = ({ fileList }: { fileList: any[] }) => {
    setFileList(fileList); // Update fileList state

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageUrl(e.target?.result as string);
          setShowPicture(true);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImageUrl(null);
    }
  };

  const handleHidePicture = () => {
    setFileList([]); // Clear file list
    setShowPicture(!showPicture);
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <Card title="Membership" style={{ border: "0" }}>
            {/* Membership Fields */}
            <Form.Item
              name="title"
              label="Membership Name (title)"
              //rules={[{ required: true, message: "Please select title" }]}
            >
              <Select
                options={titles.map((title) => ({
                  value: title,
                  label: title,
                }))}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name="name"
              label="Full name"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="membershipID"
              label="Membership ID"
              rules={[
                { required: true, message: "Please enter Membership ID" },
              ]}
            >
              <Input style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="membershipCategory"
              label="Membership Category"
              //rules={[{ required: true, message: "Please select category" }]}
            >
              <Select
                options={membershipCategory.map((category) => ({
                  value: category,
                  label: category,
                }))}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name="professionalLicenseID"
              label="Professional License ID"
              //rules={[{ required: true, message: "Please enter License ID" }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="yearOfLicense"
              label="Year of License"
              //rules={[{ required: true, message: "Please enter Year" }]}
            >
              <Input type="number" style={inputStyle} />
            </Form.Item>
            <Form.Item name="stampIDNumber" label="Stamp ID Number">
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item name="sealIDNumber" label="Seal ID Number">
              <Input style={inputStyle} />
            </Form.Item>
          </Card>
        );
      case 2:
        return (
          <Card
            title="Personal Information"
            style={{
              border: "0",
            }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Invalid email" },
              ]}
            >
              <Input type="email" style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              //rules={[{ required: true, message: "Please enter phone" }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="dob"
              label="DOB (DD/MM/YYYY)"
              //rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name="maritalStatus"
              label="Marital Status"
              //rules={[{ required: true, message: "Please select status" }]}
            >
              <Select
                options={maritalStatuses.map((status) => ({
                  value: status,
                  label: status,
                }))}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
          </Card>
        );
      case 3:
        return (
          <Card
            title="Location"
            style={{
              border: "0",
            }}
          >
            <Form.Item
              name={["countryOfOrigin", "name"]}
              label="Country of Origin"
              // rules={[{ required: true, message: "Please enter Country" }]}
            >
              <Select
                options={countryList.map((country) => ({
                  value: country,
                  label: country,
                }))}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfOrigin", "geopoliticalZone"]}
              label="Geopolitical zone"
              //rules={[{ required: true, message: "Please select zone" }]}
            >
              <Select
                options={nigeriaZones.map((zone) => ({
                  value: zone,
                  label: zone,
                }))}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfOrigin", "state"]}
              label="State of Origin"
              //rules={[{ required: true, message: "Please enter State" }]}
            >
              <Select
                options={nigeriaStates.map((state) => ({
                  value: state,
                  label: state,
                }))}
                onChange={handleStateChange}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfOrigin", "lga"]}
              label="LGA of Origin"
              //rules={[{ required: true, message: "Please enter LGA" }]}
            >
              <Select
                options={
                  selectedState
                    ? lgas[selectedState]?.map((lga: any) => ({
                        value: lga,
                        label: lga,
                      }))
                    : []
                }
                className="w-full"
                style={inputStyle}
                disabled={!selectedState}
              />
            </Form.Item>

            <Form.Item
              name={["countryOfResidence", "name"]}
              label="Country of Residence"
              //rules={[{ required: true, message: "Please enter Country" }]}
            >
              <Select
                options={countryList.map((country) => ({
                  value: country,
                  label: country,
                }))}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfResidence", "geopoliticalZone"]}
              label="Geopolitical zone"
              //rules={[{ required: true, message: "Please select zone" }]}
            >
              <Select
                options={nigeriaZones.map((zone) => ({
                  value: zone,
                  label: zone,
                }))}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfResidence", "state"]}
              label="State of Residence"
              //rules={[{ required: true, message: "Please enter State" }]}
            >
              <Select
                options={nigeriaStates.map((state) => ({
                  value: state,
                  label: state,
                }))}
                onChange={(value) => {
                  handleStateChange(value); // Reuse the existing handler
                }}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfResidence", "lga"]}
              label="LGA of Residence"
              //rules={[{ required: true, message: "Please enter LGA" }]}
            >
              <Select
                options={
                  selectedState
                    ? lgas[selectedState]?.map((lga: any) => ({
                        value: lga,
                        label: lga,
                      }))
                    : []
                }
                className="w-full"
                style={inputStyle}
                disabled={!selectedState}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfResidence", "address"]}
              label="Address of Residence"
              //rules={[{ required: true, message: "Please enter Address" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name={["countryOfOperation", "name"]}
              label="Country of Operation"
              //rules={[{ required: true, message: "Please enter Country" }]}
            >
              <Select
                options={countryList.map((country) => ({
                  value: country,
                  label: country,
                }))}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfOperation", "geopoliticalZone"]}
              label="Geopolitical zone"
              //rules={[{ required: true, message: "Please select zone" }]}
            >
              <Select
                options={nigeriaZones.map((zone) => ({
                  value: zone,
                  label: zone,
                }))}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfOperation", "state"]}
              label="State of Operation"
              //rules={[{ required: true, message: "Please enter State" }]}
            >
              <Select
                options={nigeriaStates.map((state) => ({
                  value: state,
                  label: state,
                }))}
                onChange={(value) => {
                  handleStateChange(value);
                }}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfOperation", "lga"]}
              label="LGA of Operation"
              //rules={[{ required: true, message: "Please enter LGA" }]}
            >
              <Select
                options={
                  selectedState
                    ? lgas[selectedState]?.map((lga: any) => ({
                        value: lga,
                        label: lga,
                      }))
                    : []
                }
                className="w-full"
                style={inputStyle}
                disabled={!selectedState}
              />
            </Form.Item>
            <Form.Item
              name={["countryOfOperation", "address"]}
              label="Address of operation"
              //rules={[{ required: true, message: "Please enter Address" }]}
            >
              <Input.TextArea />
            </Form.Item>
          </Card>
        );
      case 4:
        return (
          <Card title="Education" style={{ border: "0" }}>
            <Form.List name={["educationQualification", "degrees"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="mb-4">
                      <h2 className="font-bold text-gray-700 mb-2">
                        Degree {index + 1}
                      </h2>

                      {/* Degree Name */}
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        label="Degree Name"
                        //rules={[{required: true,message: "Please enter degree name",}]}
                      >
                        <Select
                          options={highestEducations.map((edu) => ({
                            value: edu,
                            label: edu,
                          }))}
                          style={inputStyle}
                        />
                      </Form.Item>

                      {/* Institution */}
                      <Form.Item
                        {...restField}
                        name={[name, "institution"]}
                        label="Institution"
                        //rules={[{required: true,message: "Please enter institution name",}]}
                      >
                        <Input style={inputStyle} />
                      </Form.Item>

                      {/* Year of Graduation */}
                      <Form.Item
                        {...restField}
                        name={[name, "year"]}
                        label="Year of Graduation"
                        //rules={[{required: true,message: "Please enter graduation year",}]}
                      >
                        <DatePicker
                          picker="year"
                          format="YYYY"
                          className="w-full"
                          style={inputStyle}
                        />
                      </Form.Item>

                      {/* Remove Button */}
                      {index > 0 && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          style={deleteButtonStyle}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  {/* Add More Button */}
                  <div className="text-right">
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      style={outlineButtonStyle}
                    >
                      Add More
                    </Button>
                  </div>
                </>
              )}
            </Form.List>
          </Card>
        );
      case 5:
        return (
          <Card title="Work Experience" style={{ border: "0" }}>
            <Form.List name={["workExperience"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="mb-4">
                      <h2 className="font-bold text-gray-700 mb-2">
                        Work Experience {index + 1}
                      </h2>

                      <Form.Item
                        {...restField}
                        name={[name, "companyName"]}
                        label="Company Name"
                        // rules={[{required: true,message: "Please enter company name",}]}
                      >
                        <Input style={inputStyle} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "role"]}
                        label="Role"
                        //rules={[{required: true,message: "Please enter your role",}]}
                      >
                        <Input style={inputStyle} />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "year"]}
                        label="Year Joined"
                        // rules={[{required: true,message: "Please enter year joined",}]}
                      >
                        <DatePicker
                          picker="year"
                          format="YYYY"
                          className="w-full"
                          style={inputStyle}
                        />
                      </Form.Item>
                      <Form.Item
                        name={[name, "address"]}
                        label="Address of Company"
                        //rules={[{required: true,message: "Please enter company address", },]}
                      >
                        <Input style={inputStyle} />
                      </Form.Item>

                      {/* Remove Button */}
                      {index > 0 && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          style={deleteButtonStyle}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  {/* Add More Button */}
                  <div className="text-right">
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      style={outlineButtonStyle}
                    >
                      Add More
                    </Button>
                  </div>
                </>
              )}
            </Form.List>
          </Card>
        );
      case 6:
        return (
          <Card
            title="Other Information"
            style={{
              border: "0",
            }}
          >
            <h2>References</h2>
            <Form.List name={["references"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="mb-4">
                      <h2 className="font-bold text-gray-700 mb-2">
                        Reference {index + 1}
                      </h2>
                      <Form.Item
                        name={[name, "name"]}
                        label="Name"
                        // rules={[{ required: true, message: "Please enter name" },]}
                      >
                        <Input style={inputStyle} />
                      </Form.Item>
                      <Form.Item
                        name={[name, "position"]}
                        label="Position"
                        //rules={[{ required: true, message: "Please enter position" }]}
                      >
                        <Input style={inputStyle} />
                      </Form.Item>
                      <Form.Item
                        name={[name, "phone"]}
                        label="Phone"
                        //rules={[{ required: true, message: "Please enter phone" },]}
                      >
                        <Input style={inputStyle} />
                      </Form.Item>
                      <Form.Item
                        name={[name, "email"]}
                        label="Email"
                        //rules={[{ required: true, message: "Please enter email" },]}
                      >
                        <Input type="email" style={inputStyle} />
                      </Form.Item>

                      {/* Remove Button */}
                      {index > 0 && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          style={deleteButtonStyle}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  {/* Add More Button */}
                  <div className="text-right">
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      style={outlineButtonStyle}
                    >
                      Add More
                    </Button>
                  </div>
                </>
              )}
            </Form.List>

            <hr className="border-gray-300 my-6"></hr>
            <Form.Item
              name="specialization"
              label="Project Management Area of Specialization"
              //rules={[{ required: true, message: "Please select Specialization" }]}
            >
              <Select
                options={[
                  { value: "IT Project Manager", label: "IT Project Manager" },
                  {
                    value: "Construction Project Manager",
                    label: "Construction Project Manager",
                  },
                ]}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
            <Form.Item
              name="occupation"
              label="Occupation"
              //rules={[{ required: true, message: "Please enter Occupation" }]}
            >
              <Input style={inputStyle} />
            </Form.Item>
            <Form.Item
              name="operationalSector"
              label="Operational sector"
              //rules={[{ required: true, message: "Please select sector" }]}
            >
              <Select
                options={operationalSectors.map((sector) => ({
                  value: sector,
                  label: sector,
                }))}
                className="w-full"
                style={inputStyle}
              />
            </Form.Item>
          </Card>
        );

      case 7:
        return (
          <Card
            title="Review & Submit"
            style={{
              border: "0",
            }}
          >
            <div>Review and submit</div>
          </Card>
        );
      default:
        return null;
    }
  };

  const steps = [
    { title: "Membership", step: 1 },
    { title: "Personal Information", step: 2 },
    { title: "Location", step: 3 },
    { title: "Education", step: 4 },
    { title: "Work Experience", step: 5 },
    { title: "Other Information", step: 6 },
    { title: "Review & Submit", step: 7 },
  ];

  return (
    <div className="w-full min-h-screen">
      <Breadcrumb
        style={{ fontSize: "12px", textAlign: "left" }}
        items={[
          {
            title: <a href="/">Home</a>,
          },
          {
            title: <a href="/membership">Membership list</a>,
          },
          {
            title: "Edit",
          },
        ]}
      />
      <div className="flex items-center justify-between gap-2 my-3">
        <h2 className="text-2xl text-[#14401D]">Edit Member Registration</h2>
      </div>
      <div className="w-full  bg-white  flex flex-col md:flex-row">
        {/* Left Side Menu */}

        <div className="hidden md:block w-full md:w-64 mb-8 md:mb-0 md:mr-8 border-r border-r-gray-200 pr-8">
          <div>
            {steps.map((s) => (
              <div
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={cn(
                  "flex items-center px-4 py-1 transition-colors border-b border-b-gray-300 duration-300 cursor-pointer",
                  currentStep === s.step
                    ? " text-gray-700 font-semibold"
                    : currentStep > s.step
                    ? "bg-green-100 text-green-600 font-medium"
                    : " text-gray-700",
                  "w-full justify-start" // Ensure left alignment
                )}
              >
                {currentStep > s.step ? (
                  <CheckCircleOutlined className="w-5 h-5" />
                ) : (
                  s.step < currentStep && (
                    <CheckCircleOutlined className="w-5 h-5" />
                  )
                )}
                <span className="text-left">{s.title}</span>{" "}
                {/* Ensure text is left-aligned */}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          <Form
            form={form}
            layout="vertical"
            className="space-y-6"
            size="large"
          >
            {renderStep(currentStep)}

            <div className="flex justify-between mt-6">
              <Button
                disabled={currentStep === 1}
                onClick={handlePrev}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#ccc",
                  borderColor: "#bbb",
                  color: "#333",
                }}
                className="hover:shadow-md"
              >
                <ArrowLeftOutlined /> Previous
              </Button>
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  style={buttonStyle}
                  className="hover:shadow-md"
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      buttonHoverStyle.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      buttonStyle.backgroundColor)
                  }
                >
                  Next <ArrowRightOutlined />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  style={buttonStyle}
                  className="hover:shadow-md"
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      buttonHoverStyle.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      buttonStyle.backgroundColor)
                  }
                >
                  Submit <CheckCircleOutlined />
                </Button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
