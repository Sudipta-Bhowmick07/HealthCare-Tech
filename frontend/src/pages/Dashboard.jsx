import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

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

  // REMINDER STATES

  const [reminders, setReminders] = useState([]);

  const [medicineName, setMedicineName] = useState("");

  const [dosage, setDosage] = useState("");

  const [frequency, setFrequency] = useState("Once Daily");

  const [durationDays, setDurationDays] = useState("");

  const [times, setTimes] = useState([""]);

  useEffect(() => {

    if (!token) {

      navigate("/");

      return;
    }

    fetchHistory();

    fetchReminders();

  }, []);

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
  // LOGOUT
  // ==========================

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-6xl font-bold text-blue-600">
          MedAssist Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-3 rounded-xl"
        >
          Logout
        </button>

      </div>

      {/* OCR SECTION */}

      <div className="bg-white p-10 rounded-2xl shadow-xl mb-10">

        <h2 className="text-4xl font-bold mb-8">
          Upload Prescription
        </h2>

        <div className="flex items-center gap-5 mb-6">

          <input
            type="file"
            onChange={handleFileChange}
          />

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl"
          >
            Upload
          </button>

        </div>

        {
          preview && (

            <img
              src={preview}
              alt="preview"
              className="w-[400px] rounded-xl border"
            />

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

      {/* REMINDER SECTION */}

      <div className="bg-white p-10 rounded-2xl shadow-xl">

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

        {/* DYNAMIC TIMES */}

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

        {/* REMINDER LIST */}

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

    </div>
  );
}

export default Dashboard;