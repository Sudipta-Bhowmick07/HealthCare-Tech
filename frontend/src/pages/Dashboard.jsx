import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  LogOut,
  HeartPulse,
  Upload,
  FileImage
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

  const [medicineName, setMedicineName] = useState("");

  const [dosage, setDosage] = useState("");

  const [frequency, setFrequency] = useState("Once Daily");

  const [durationDays, setDurationDays] = useState("");

  const [times, setTimes] = useState(["09:00"]);

  const [analytics, setAnalytics] = useState(null);

  const [user, setUser] = useState(null);

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
      "http://127.0.0.1:8000/auth/me",
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
        "http://127.0.0.1:8000/ocr/history",
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
  // FETCH REMINDERS
  // ==========================

  const fetchReminders = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/reminders/my-reminders",
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
      "http://127.0.0.1:8000/adherence/analytics",
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
        "http://127.0.0.1:8000/ocr/upload",
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

      alert("Upload failed");
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
        "http://127.0.0.1:8000/reminders/add",
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
        `http://127.0.0.1:8000/reminders/${id}`,
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

            `http://127.0.0.1:8000/pharmacy/nearby?lat=${lat}&lon=${lon}`

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
      `http://127.0.0.1:8000/adherence/taken/${id}`,
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
        `http://127.0.0.1:8000/adherence/missed/${id}`,
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

    <div className="min-h-screen bg-gray-100 p-10">

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

      <div className="bg-white p-10 rounded-2xl shadow-xl mb-10">

        <h2 className="text-3xl font-bold mb-6">
          Upload History
        </h2>

        {
          history.length === 0 ? (

            <p>No history found</p>

          ) : (

            history.map((item, index) => (

              <div
                key={index}
                className="border p-5 rounded-xl mb-5"
              >

                <p className="font-semibold mb-2">

                  File:
                  {" "}
                  {item?.filename}

                </p>

                <p className="mb-2">

                  Medicines:
                  {" "}
                  {item?.medicines}

                </p>

                <p className="mb-2">

                  Date:
                  {" "}
                  {item?.created_at}

                </p>

                <a
                  href={`http://127.0.0.1:8000${item?.pdf_download}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Download PDF
                </a>

              </div>

            ))

          )
        }

      </div>


{/* ANALYTICS SECTION */}

{
  analytics && (

    <div className="bg-white p-10 rounded-2xl shadow-xl mb-10">

      <h2 className="text-3xl font-bold mb-6">
        Medicine Adherence Analytics
      </h2>

      <div className="grid grid-cols-3 gap-5">

        <div className="bg-green-100 p-5 rounded-xl">
          <h3 className="text-xl font-bold">
            Taken
          </h3>

          <p className="text-3xl">
            {analytics.total_taken}
          </p>
        </div>

        <div className="bg-yellow-100 p-5 rounded-xl">
          <h3 className="text-xl font-bold">
            Missed
          </h3>

          <p className="text-3xl">
            {analytics.total_missed}
          </p>
        </div>

        <div className="bg-blue-100 p-5 rounded-xl">
          <h3 className="text-xl font-bold">
            Adherence %
          </h3>

          <p className="text-3xl">
            {analytics.adherence_rate}%
          </p>
        </div>

      </div>

    </div>

  )
}

{/* REMINDER SECTION */}
     

      <div className="bg-white p-10 rounded-2xl shadow-xl mb-10">

        <h2 className="text-4xl font-bold mb-8">
          Medicine Reminders
        </h2>

        <div className="grid grid-cols-5 gap-5 mb-5">

          <input
            type="text"
            placeholder="Medicine Name"
            value={medicineName}
            onChange={(e) =>
              setMedicineName(e.target.value)
            }
            className="border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Dosage"
            value={dosage}
            onChange={(e) =>
              setDosage(e.target.value)
            }
            className="border p-3 rounded"
          />

          <select
            value={frequency}
            onChange={(e) =>
              handleFrequencyChange(
                e.target.value
              )
            }
            className="border p-3 rounded"
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
            className="border p-3 rounded"
          />

          <button
            onClick={addReminder}
            className="bg-green-600 text-white rounded"
          >
            Add Reminder
          </button>

        </div>

        <div className="flex gap-5 mb-8">

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
                className="border p-3 rounded"
              />

            ))
          }

        </div>

        {
          reminders.map((reminder) => (

            <div
              key={reminder.id}
              className="border p-5 rounded-xl mb-5 flex justify-between items-center"
            >

              <div>

                <p>
                  <strong>Medicine:</strong>
                  {" "}
                  {reminder.medicine_name}
                </p>

                <p>
                  <strong>Dosage:</strong>
                  {" "}
                  {reminder.dosage}
                </p>

                <p>
                  <strong>Frequency:</strong>
                  {" "}
                  {reminder.frequency}
                </p>

                <p>
                  <strong>Times:</strong>
                  {" "}
                  {reminder.reminder_times}
                </p>

                <p>
                  <strong>Ends:</strong>
                  {" "}
                  {reminder.end_date}
                </p>

              </div>
              <div className="flex gap-3 mt-4">

  <button
    onClick={() =>
      markTaken(reminder.id)
    }
    className="bg-green-500 text-white px-4 py-2 rounded"
  >
    Taken
  </button>

  <button
    onClick={() =>
      markMissed(reminder.id)
    }
    className="bg-yellow-500 text-white px-4 py-2 rounded"
  >
    Missed
  </button>

</div>
              <button
                onClick={() =>
                  deleteReminder(reminder.id)
                }
                className="bg-red-500 text-white px-5 py-2 rounded"
              >
                Delete
              </button>

            </div>

          ))
        }

      </div>

      {/* NEARBY PHARMACIES */}

      <div className="bg-white p-10 rounded-2xl shadow-xl mt-10">

        <h2 className="text-3xl font-bold mb-6">

          Nearby Pharmacies

        </h2>

        <button
          onClick={searchPharmacies}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl mb-6"
        >
          Find Nearby Pharmacies
        </button>

        {
  pharmacies.length > 0 ? (

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {
        pharmacies.map((pharmacy, index) => (

          <div
            key={index}
            className="border p-5 rounded-xl bg-white shadow"
          >

            <h3 className="text-xl font-bold mb-3">

              {
                pharmacy.name ||
                "Unknown Pharmacy"
              }

            </h3>

            <p className="mb-3 text-gray-700">

              {
                pharmacy.address ||
                "Address not available"
              }

            </p>

            <p className="text-sm text-green-600 mb-3">

              Source:
              {" "}
              {pharmacy.source}

            </p>

            <a
              href={pharmacy.map_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Open in Maps
            </a>

          </div>

        ))
      }

    </div>

  ) : (

    <p>No pharmacies found yet</p>

  )
}

      </div>

    </div>
  );
}

export default Dashboard;