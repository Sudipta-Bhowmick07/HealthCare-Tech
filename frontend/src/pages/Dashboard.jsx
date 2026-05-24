import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  LogOut,
  History,
  Pill,
  FileText,
  Download,
  Calendar,
  HeartPulse,
  Bell,
  MapPin,
  Clock,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Trash2,
  Upload,
  FileImage,
  BarChart3,
  AlertTriangle,
  Target
} from "lucide-react";

function Dashboard() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // OCR STATES

  const [selectedFile, setSelectedFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [history, setHistory] = useState([]);

  const [ocrResult, setOcrResult] = useState("");

  const [medicines, setMedicines] = useState([]);

  const [warnings, setWarnings] = useState([]);

  // PHARMACY STATES

  const [pharmacies, setPharmacies] = useState([]);

  // REMINDER STATES

  const [reminders, setReminders] = useState([]);

  const [reminderForm, setReminderForm] = useState({
  medicine_name: "",
  dosage: "",
  frequency: 1,
  duration_days: 7,
  reminder_times: [""]
  });

  const [medicineName, setMedicineName] = useState("");

  const [dosage, setDosage] = useState("");

  const [frequency, setFrequency] = useState("Once Daily");

  const [durationDays, setDurationDays] = useState("");

  const [times, setTimes] = useState(["09:00"]);

  const [analytics, setAnalytics] = useState(null);

  const [user, setUser] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);





  useEffect(() => {

    if (!token) {

      navigate("/");

      return;
    }

    fetchUser();

    fetchHistory();

    fetchReminders();

    fetchAnalytics();

  }, []);

  // DEBUG

  console.log("PHARMACIES STATE:");
  console.log(pharmacies);

  const fetchUser = async () => {

  try {

    const response = await axios.get(
      "https://medassist-ai-backend-xyz6.onrender.com/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUser(response.data);

  } catch (error) {

    console.log(error);
  }
};
  // ==========================
  // FETCH HISTORY
  // ==========================

  const fetchHistory = async () => {

    try {

      const response = await axios.get(
        "https://medassist-ai-backend-xyz6.onrender.com/ocr/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(response.data);

    } catch (error) {

      console.log(error);
    }
  };


  // ==========================
  // DELETE UPLOAD PRESCRIPTION
  // ==========================

  const handleSelect = (id) => {

  if (selectedItems.includes(id)) {

    setSelectedItems(
      selectedItems.filter(
        itemId => itemId !== id
      )
    );

  } else {

    setSelectedItems([
      ...selectedItems,
      id
    ]);

  }

};

  const deleteSelected = async () => {

  const token =
    localStorage.getItem("token");

  try {

    await Promise.all(

      selectedItems.map((id) =>

        axios.delete(
          `https://medassist-ai-backend-xyz6.onrender.com/ocr/history/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

      )

    );

    setHistory(

      history.filter(
        item =>
          !selectedItems.includes(item.id)
      )

    );

    setSelectedItems([]);

  } catch (error) {

    alert("Delete failed");

  }

};

  // ==========================
  // FETCH REMINDERS
  // ==========================

  const fetchReminders = async () => {

    try {

      const response = await axios.get(
        "https://medassist-ai-backend-xyz6.onrender.com/reminders/my-reminders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReminders(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  


  // ==========================
  // FETCH ANALYTICS
  // ==========================

  const fetchAnalytics = async () => {

  try {

    const response = await axios.get(
      "https://medassist-ai-backend-xyz6.onrender.com/adherence/analytics",
      {
        headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    );

    setAnalytics(response.data);

  } catch (error) {

    console.log(error);
  }
};
  // ==========================
  // FILE CHANGE
  // ==========================

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    setSelectedFile(file);

    setPreview(URL.createObjectURL(file));
  };

  // ==========================
  // OCR UPLOAD
  // ==========================

  const handleUpload = async () => {

    if (!selectedFile) {

      alert("Please select file");

      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {

      const response = await axios.post(
        "https://medassist-ai-backend-xyz6.onrender.com/ocr/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setOcrResult(response.data.ocr_text);

      setMedicines(response.data.medicines || []);

      setWarnings(
        response.data.interaction_warnings || []
      );

      fetchHistory();

      alert("Prescription uploaded successfully");

    } catch (error) {

      console.log(error);

      console.log(
    error.response?.data
  );

  alert(
    error.response?.data?.detail ||
    "Upload failed"
  );
    }
  };

  // ==========================
  // FREQUENCY CHANGE
  // ==========================

  const handleFrequencyChange = (value) => {

    setFrequency(value);

    if (value === "Once Daily") {

      setTimes(["09:00"]);
    }

    else if (value === "Twice Daily") {

      setTimes([
        "09:00",
        "21:00"
      ]);
    }

    else if (value === "Thrice Daily") {

      setTimes([
        "08:00",
        "14:00",
        "20:00"
      ]);
    }
  };

  // ==========================
  // TIME CHANGE
  // ==========================

  const handleTimeChange = (
    index,
    value
  ) => {

    const updatedTimes = [...times];

    updatedTimes[index] = value;

    setTimes(updatedTimes);
  };

  // ==========================
  // ADD REMINDER
  // ==========================

  const addReminder = async () => {

    try {

      await axios.post(
        "https://medassist-ai-backend-xyz6.onrender.com/reminders/add",
        {
          medicine_name: medicineName,
          dosage: dosage,
          frequency: frequency,
          reminder_times: times,
          duration_days: parseInt(durationDays)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchReminders();

      setMedicineName("");

      setDosage("");

      setDurationDays("");

      alert("Reminder added");

    } catch (error) {

      console.log(error);

      alert("Failed to add reminder");
    }
  };

  // ==========================
  // DELETE REMINDER
  // ==========================

  const deleteReminder = async (id) => {

    try {

      await axios.delete(
        `https://medassist-ai-backend-xyz6.onrender.com/reminders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchReminders();

    } catch (error) {

      console.log(error);
    }
  };

  // ==========================
  // FIND PHARMACIES
  // ==========================

  const searchPharmacies = async () => {

    if (!navigator.geolocation) {

      alert("Geolocation not supported");

      return;
    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          
          const lat = position.coords.latitude;

          const lon = position.coords.longitude;

          console.log("Latitude:", lat);

          console.log("Longitude:", lon);

          const response = await axios.get(

            `https://medassist-ai-backend-xyz6.onrender.com/pharmacy/nearby?lat=${lat}&lon=${lon}`

          );

          console.log("PHARMACY RESPONSE:");

          console.log(response.data);

          setPharmacies(response.data);

        } catch (error) {

          console.log(error);

          alert("Failed to fetch pharmacies");
        }
      },

      (error) => {

        console.log(error);

        alert("Location permission denied");
      }
    );
  };

  // ==========================
  // LOGOUT
  // ==========================

  const markTaken = async (id) => {

  try {

    await axios.post(
      `https://medassist-ai-backend-xyz6.onrender.com/adherence/taken/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchAnalytics();
    alert("Medicine marked as taken");
    

  } catch (error) {

    console.log(error);

    alert("Failed");
  }
};


  const markMissed = async (id) => {

    try {

      await axios.post(
        `https://medassist-ai-backend-xyz6.onrender.com/adherence/missed/${id}`,
        {},
        {
          headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      
      fetchAnalytics();
      alert("Medicine marked as missed");
    } 
    catch (error) {

      console.log(error);

      alert("Failed");
    }
  };

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  return (

<div
  className="
    min-h-screen
    p-10
    bg-gradient-to-br
    from-sky-50
    via-blue-50
    to-cyan-100
  "
>
      {/* HEADER */}

      <div className="mb-12">

  <div className="flex justify-between items-center">

    <div>

      <div className="flex items-center gap-4">

        <div className="
          w-14 h-14
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          via-indigo-600
          to-cyan-500
          flex
          items-center
          justify-center
          shadow-lg
        ">
          <HeartPulse
            size={28}
            className="text-white"
          />
        </div>

        <div>

          <h1 className="
            text-5xl
            font-extrabold
            bg-gradient-to-r
            from-blue-600
            via-indigo-600
            to-cyan-500
            bg-clip-text
            text-transparent
          ">
            MedAssist AI
          </h1>

          <p className="text-gray-500 mt-1">
            Smart Healthcare Assistant
          </p>

        </div>

      </div>

      <div className="mt-6">

        <h2 className="text-3xl font-bold text-slate-800">

          Hello,
          {" "}
          <span className="
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            bg-clip-text
            text-transparent
          ">
            {user?.full_name || "User"}
          </span>
          👋

        </h2>

        <p className="text-gray-500 mt-2">
          Welcome back to your health dashboard.
        </p>

      </div>

    </div>

    <button
      onClick={handleLogout}
      className="
        flex
        items-center
        gap-2
        px-6
        py-3
        rounded-2xl
        bg-red-500
        hover:bg-red-600
        text-white
        transition-all
      "
    >
      <LogOut size={18} />
      Logout
    </button>

  </div>

</div>

      {/* OCR SECTION */}

<div
  className="
    bg-white/70
    backdrop-blur-xl
    border border-white/50
    rounded-[32px]
    shadow-xl
    p-10
    mb-10
  "
>

  <div className="flex items-center gap-4 mb-8">

    <div
      className="
        w-14
        h-14
        rounded-2xl
        bg-gradient-to-r
        from-blue-600
        via-indigo-600
        to-cyan-500
        flex
        items-center
        justify-center
        shadow-lg
      "
    >
      <Upload
        size={28}
        className="text-white"
      />
    </div>

    <div>

      <h2 className="text-4xl font-bold text-slate-800">
        Upload Prescription
      </h2>

      <p className="text-gray-500 mt-1">
        Upload a prescription image for AI analysis
      </p>

    </div>

  </div>

  <div
    className="
      border-2
      border-dashed
      border-blue-200
      rounded-3xl
      p-12
      text-center
      bg-gradient-to-br
      from-blue-50
      to-cyan-50
      hover:border-blue-500
      transition-all
      duration-300
    "
  >

    <FileImage
      size={64}
      className="
        mx-auto
        mb-4
        text-blue-500
      "
    />

    <h3 className="text-2xl font-semibold text-slate-800 mb-2">
      Drag & Drop Prescription
    </h3>

    <p className="text-gray-500 mb-6">
      JPG, PNG or PDF files
    </p>

    <input
  id="prescription-upload"
  type="file"
  onChange={handleFileChange}
  className="hidden"
/>

<div className="flex items-center justify-center gap-4 flex-wrap">

  <label
    htmlFor="prescription-upload"
    className="
      h-14
      px-6
      inline-flex
      items-center
      gap-3
      rounded-2xl
      bg-white
      border
      border-blue-200
      cursor-pointer
      hover:border-blue-500
      hover:shadow-md
      transition-all
      font-medium
      text-slate-700
    "
  >
    <FileImage size={20} />
    Choose Prescription File
  </label>

  {selectedFile && (
    <div
      className="
        h-14
        px-4
        inline-flex
        items-center
        gap-2
        rounded-2xl
        bg-blue-100
        text-blue-700
        text-sm
        font-medium
        max-w-[280px]
        overflow-hidden
        whitespace-nowrap
        text-ellipsis
      "
    >
      <FileImage size={16} />
      {selectedFile.name}
    </div>
  )}

  <button
    onClick={handleUpload}
    className="
      h-14
      px-8
      rounded-2xl
      text-white
      font-semibold
      bg-gradient-to-r
      from-blue-600
      via-indigo-600
      to-cyan-500
      shadow-lg
      hover:scale-105
      transition-all
    "
  >
    Upload Prescription
  </button>
</div>
</div>
  {
    preview && (

      <div className="mt-10">

  <h3
    className="
      text-xl
      font-bold
      text-slate-800
      mb-5
    "
  >
    Prescription Preview
  </h3>

  <div
    className="
      inline-block
      bg-white
      p-4
      rounded-3xl
      shadow-xl
      border
      border-slate-100
    "
  >

    <img
      src={preview}
      alt="preview"
      className="
        w-[350px]
        rounded-2xl
      "
    />

    <div className="mt-4">

      <p
        className="
          text-sm
          text-slate-500
        "
      >
        Selected File
      </p>

      <p
        className="
          font-semibold
          text-slate-800
          truncate
          max-w-[320px]
        "
      >
        {selectedFile?.name}
      </p>

    </div>

  </div>

</div>

    )
  }

</div>

      {/* OCR RESULT */}

      {
        ocrResult && (

          <div className="bg-white p-10 rounded-2xl shadow-xl mb-10">

            <h2 className="text-3xl font-bold mb-5">
              OCR Extracted Text
            </h2>

            <p className="text-lg whitespace-pre-line">
              {ocrResult}
            </p>

          </div>

        )
      }

      {/* MEDICINES */}

      {
        medicines.length > 0 && (

          <div className="bg-white p-10 rounded-2xl shadow-xl mb-10">

            <h2 className="text-3xl font-bold mb-5">
              Detected Medicines
            </h2>

            <ul className="list-disc pl-8">

              {
                medicines.map((medicine, index) => (

                  <li
                    key={index}
                    className="text-lg mb-2"
                  >
                    {medicine}
                  </li>

                ))
              }

            </ul>

          </div>

        )
      }

      {/* WARNINGS */}

      {
        warnings.length > 0 && (

          <div className="bg-red-100 p-10 rounded-2xl shadow-xl mb-10">

            <h2 className="text-3xl font-bold text-red-600 mb-5">
              Drug Interaction Warnings
            </h2>

            <ul className="list-disc pl-8">

              {
                warnings.map((warning, index) => (

                  <li
                    key={index}
                    className="text-red-700 text-lg mb-2"
                  >
                    {warning}
                  </li>

                ))
              }

            </ul>

          </div>

        )
      }

      {/* HISTORY */}

<div className="bg-white p-10 rounded-3xl shadow-xl mb-10">

  <div className="flex items-center gap-4 mb-8">

    <div
      className="
        w-14
        h-14
        rounded-2xl
        bg-gradient-to-r
        from-blue-600
        via-indigo-600
        to-cyan-500
        flex
        items-center
        justify-center
        text-white
        shadow-lg
      "
    >
      <History size={28} />
    </div>

   <div className="flex-1">

    <div className="flex items-center justify-between">

      <h2 className="text-3xl font-bold">
        Upload History
      </h2>

      {
        selectedItems.length > 0 && (

          <button
            onClick={deleteSelected}
            className="
              px-5
              py-3
              rounded-xl
              bg-red-500
              text-white
              font-semibold
              hover:bg-red-600
              transition
            "
          >
            Delete Selected ({selectedItems.length})
          </button>

        )
      }

    </div>
      <p className="text-slate-500">
        Previously analyzed prescriptions
      </p>

    </div>

  </div>

  {history.length === 0 ? (

    <div
      className="
        text-center
        py-16
        rounded-3xl
        bg-slate-50
        border
        border-dashed
        border-slate-300
      "
    >
      <FileText
        size={50}
        className="mx-auto text-slate-400 mb-4"
      />

      <p className="text-slate-500 text-lg">
        No prescription history found
      </p>
    </div>

  ) : (

    <div className="grid gap-6">

      {history.map((item, index) => (

        <div
          key={index}
          className="
            bg-gradient-to-br
            from-white
            to-slate-50
            border
            border-slate-200
            rounded-3xl
            p-6
            shadow-md
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
          "
        >
          <div className="flex justify-between items-start">

  <input
    type="checkbox"
    checked={selectedItems.includes(item.id)}
    onChange={() => handleSelect(item.id)}
    className="
      w-5
      h-5
      accent-blue-600
      cursor-pointer
    "
  />

</div>

          <div className="flex justify-between items-start">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <FileText
                  size={20}
                  className="text-blue-600"
                />

                <h3 className="font-bold text-lg text-slate-800">

                  Prescription #{index + 1}

                </h3>

              </div>

              <p className="text-slate-600 mb-4 break-all">

                {item?.filename}

              </p>

            </div>

            <a
              href={item?.pdf_download}
              target="_blank"
              rel="noreferrer"
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                bg-blue-600
                text-white
                hover:bg-blue-700
                transition-all
              "
            >
              <Download size={16} />
              PDF
            </a>

          </div>

          <div
            className="
              flex
              items-center
              gap-3
              bg-blue-50
              rounded-2xl
              p-4
              mb-4
            "
          >

            <Pill
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-slate-500">
                Medicines Detected
              </p>

              <p className="font-semibold text-slate-800">
                {item?.medicines}
              </p>

            </div>

          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >

            <Calendar size={16} />

            {item?.created_at}

          </div>

        </div>

      ))}

    </div>

  )}

</div>


{/* ANALYTICS SECTION */}

{
  analytics && (

    <div className="bg-white p-10 rounded-3xl shadow-xl mb-10">

      <div className="flex items-center gap-4 mb-8">

        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            via-indigo-600
            to-cyan-500
            flex
            items-center
            justify-center
            text-white
            shadow-lg
          "
        >
          <BarChart3 size={28} />
        </div>

        <div>

          <h2 className="text-4xl font-bold text-slate-800">
            Medicine Adherence Analytics
          </h2>

          <p className="text-slate-500">
            Track your medication consistency
          </p>

        </div>

      </div>

      {/* Progress Bar */}

      <div className="mb-10">

        <div className="flex justify-between mb-3">

          <span className="font-semibold text-slate-700">
            Overall Adherence
          </span>

          <span className="font-bold text-blue-600">
            {analytics.adherence_rate}%
          </span>

        </div>

        <div
          className="
            w-full
            h-5
            bg-slate-200
            rounded-full
            overflow-hidden
          "
        >

          <div
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-green-500
              via-blue-500
              to-cyan-500
              transition-all
              duration-700
            "
            style={{
              width: `${analytics.adherence_rate}%`
            }}
          />

        </div>

      </div>

      {/* Analytics Cards */}

      <div className="grid md:grid-cols-3 gap-6">

        {/* Taken */}

        <div
          className="
            bg-green-50
            border
            border-green-200
            rounded-3xl
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center gap-3 mb-4">

            <CheckCircle
              size={28}
              className="text-green-600"
            />

            <h3 className="font-semibold text-slate-700">
              Medicines Taken
            </h3>

          </div>

          <p
            className="
              text-5xl
              font-bold
              text-green-600
            "
          >
            {analytics.total_taken}
          </p>

        </div>

        {/* Missed */}

        <div
          className="
            bg-yellow-50
            border
            border-yellow-200
            rounded-3xl
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center gap-3 mb-4">

            <AlertTriangle
              size={28}
              className="text-yellow-600"
            />

            <h3 className="font-semibold text-slate-700">
              Missed Doses
            </h3>

          </div>

          <p
            className="
              text-5xl
              font-bold
              text-yellow-600
            "
          >
            {analytics.total_missed}
          </p>

        </div>

        {/* Adherence */}

        <div
          className="
            bg-blue-50
            border
            border-blue-200
            rounded-3xl
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center gap-3 mb-4">

            <Target
              size={28}
              className="text-blue-600"
            />

            <h3 className="font-semibold text-slate-700">
              Adherence Rate
            </h3>

          </div>

          <p
            className="
              text-5xl
              font-bold
              text-blue-600
            "
          >
            {analytics.adherence_rate}%
          </p>

        </div>

      </div>

    </div>

  )
}

{/* REMINDER SECTION */}

<div className="bg-white p-10 rounded-3xl shadow-xl mb-10">

  <div className="flex items-center gap-4 mb-8">

    <div
      className="
        w-14
        h-14
        rounded-2xl
        bg-gradient-to-r
        from-blue-600
        via-indigo-600
        to-cyan-500
        flex
        items-center
        justify-center
        text-white
        shadow-lg
      "
    >
      <Bell size={28} />
    </div>

    <div>

      <h2 className="text-4xl font-bold text-slate-800">
        Medication Reminders
      </h2>

      <p className="text-slate-500">
        Stay consistent with your medicine schedule
      </p>
      <p className="text-sm text-blue-600 font-medium mt-1">
    {reminders.length} active reminder(s)
  </p>

    </div>

  </div>

  <div className="grid md:grid-cols-5 gap-4 mb-6">

    <input
      type="text"
      placeholder="Medicine Name"
      value={medicineName}
      onChange={(e) =>
        setMedicineName(e.target.value)
      }
      className="border border-slate-200 p-4 rounded-2xl min-w-[180px]"
    />

    <input
      type="text"
      placeholder="Dosage"
      value={dosage}
      onChange={(e) =>
        setDosage(e.target.value)
      }
      className="border border-slate-200 p-4 rounded-2xl min-w-[180px]"
    />

    <select
      value={frequency}
      onChange={(e) =>
        handleFrequencyChange(
          e.target.value
        )
      }
      className="border border-slate-200 p-4 rounded-2xl min-w-[180px]"
    >

      <option>
        Once Daily
      </option>

      <option>
        Twice Daily
      </option>

      <option>
        Thrice Daily
      </option>

    </select>

    <input
      type="number"
      placeholder="Duration Days"
      value={durationDays}
      onChange={(e) =>
        setDurationDays(e.target.value)
      }
      className="border border-slate-200 p-4 rounded-2xl min-w-[180px]"
    />

    <button
      onClick={addReminder}
      className="
        bg-gradient-to-r
        from-blue-600
        via-indigo-600
        to-cyan-500
        text-white
        rounded-2xl
        font-semibold
        shadow-lg
        hover:scale-105
        transition-all
      "
    >
      Add Reminder
    </button>

  </div>

  <div className="flex gap-4 mb-8 flex-wrap">

    {
      times.map((time, index) => (

        <input
          key={index}
          type="time"
          value={time}
          onChange={(e) =>
            handleTimeChange(
              index,
              e.target.value
            )
          }
          className="
            border
            border-slate-200
            p-4
            rounded-2xl
          "
        />

      ))
    }

  </div>

  <div className="grid gap-5">

    {
      reminders.map((reminder) => (

        <div
          key={reminder.id}
          className="
            bg-gradient-to-br
            from-white
            to-slate-50
            border
            border-slate-200
            rounded-3xl
            p-6
            shadow-md
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
          "
        >

          <div className="flex justify-between items-start">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <Pill
                  size={20}
                  className="text-blue-600"
                />

                <h3 className="font-bold text-xl text-slate-800">

                  {reminder.medicine_name}

                </h3>

              </div>

              <p className="text-slate-600 mb-2">
                Dosage: {reminder.dosage}
              </p>

              <p className="text-slate-600 mb-2">
                Frequency: {reminder.frequency}
              </p>

              <p className="text-slate-600 mb-2">
                Time: {reminder.reminder_times}
              </p>

              <p className="text-slate-500">
                Ends: {reminder.end_date}
              </p>

            </div>

            <Clock
              size={26}
              className="text-cyan-500"
            />

          </div>

          <div className="flex gap-3 mt-6 flex-wrap">

            <button
              onClick={() =>
                markTaken(reminder.id)
              }
              className="
                flex
                items-center
                gap-2
                bg-green-500
                hover:bg-green-600
                text-white
                px-4
                py-2
                rounded-xl
                transition
              "
            >
              <CheckCircle size={16} />
              Taken
            </button>

            <button
              onClick={() =>
                markMissed(reminder.id)
              }
              className="
                flex
                items-center
                gap-2
                bg-yellow-500
                hover:bg-yellow-600
                text-white
                px-4
                py-2
                rounded-xl
                transition
              "
            >
              <AlertCircle size={16} />
              Missed
            </button>

            <button
              onClick={() =>
                deleteReminder(reminder.id)
              }
              className="
                flex
                items-center
                gap-2
                bg-red-500
                hover:bg-red-600
                text-white
                px-4
                py-2
                rounded-xl
                transition
              "
            >
              <Trash2 size={16} />
              Delete
            </button>

          </div>

        </div>

      ))
    }

  </div>

</div>
{/* NEARBY PHARMACIES */}

<div className="bg-white p-10 rounded-3xl shadow-xl mt-10">

  <div className="flex justify-between items-center mb-8">

    <div className="flex items-center gap-4">

  <div
    className="
      w-12
      h-12
      rounded-2xl
      bg-gradient-to-r
      from-blue-600
      via-indigo-600
      to-cyan-500
      flex
      items-center
      justify-center
      text-white
      shadow-lg
    "
  >
    <MapPin size={24} />
  </div>

  <div>

    <h2 className="text-4xl font-bold text-slate-800">
      Nearby Pharmacies
    </h2>

    <p className="text-slate-500 mt-1">
      {pharmacies.length > 0
        ? `${pharmacies.length} pharmacies found nearby`
        : "Find pharmacies around your location"}
    </p>

  </div>

</div>

    <button
      onClick={searchPharmacies}
      className="
        px-6
        py-3
        rounded-2xl
        text-white
        font-semibold
        bg-gradient-to-r
        from-blue-600
        via-indigo-600
        to-cyan-500
        shadow-lg
        hover:scale-105
        transition-all
      "
    >
      Find Nearby Pharmacies
    </button>

  </div>

  {
    pharmacies.length > 0 ? (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {
          pharmacies.filter(
      (pharmacy) =>
        pharmacy.name &&
        pharmacy.name !== "Unknown Pharmacy" &&
        /^[A-Za-z0-9\s&.,'-]+$/.test(pharmacy.name)
    ).map((pharmacy, index) => (

            <div
              key={index}
              className="
                bg-gradient-to-br
                from-white
                to-slate-50
                border
                border-slate-200
                rounded-3xl
                p-6
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >

              <div className="flex justify-between items-start mb-4">

                <h3 className="text-xl font-bold text-slate-800">

                  {
                    pharmacy.name ||
                    "Unknown Pharmacy"
                  }

                </h3>

                <span
                  className="
                    bg-green-100
                    text-green-700
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                  "
                >
                  Nearby
                </span>

              </div>

              <p className="text-slate-600 mb-4 leading-relaxed">

                {
                  pharmacy.address ||
                  "Address not available"
                }

              </p>

              <div
                className="
                  bg-blue-50
                  rounded-2xl
                  p-3
                  mb-4
                "
              >

                <p className="text-sm text-slate-500">
                  Source
                </p>

                <p className="font-medium text-blue-700">

                  {pharmacy.source}

                </p>

              </div>

              <a
                href={pharmacy.map_url}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-600
                  text-white
                  hover:bg-blue-700
                  transition-all
                "
              >
                Open in Maps
              </a>

            </div>

          ))
        }

      </div>

    ) : (

      <div
        className="
          text-center
          py-16
          rounded-3xl
          bg-slate-50
          border
          border-dashed
          border-slate-300
        "
      >

        <p className="text-slate-500 text-lg">
          No pharmacies found yet
        </p>

      </div>

    )
  }

</div>

    </div>
  );
}

export default Dashboard;