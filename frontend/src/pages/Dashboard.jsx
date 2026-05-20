import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [history, setHistory] = useState([]);

  const [ocrResult, setOcrResult] = useState("");

  const [medicines, setMedicines] = useState([]);

  const [warnings, setWarnings] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!token) {
      navigate("/");
      return;
    }

    fetchHistory();

  }, []);

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

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    setSelectedFile(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {

    if (!selectedFile) {

      alert("Please select a file");

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

      setMedicines(response.data.medicines);

      setWarnings(response.data.interaction_warnings);

      fetchHistory();

      alert("Prescription uploaded successfully");

    } catch (error) {

      console.log(error);

      alert("Upload failed");
    }
  };

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

      {/* UPLOAD SECTION */}

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

      {/* INTERACTION WARNINGS */}

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

      <div className="bg-white p-10 rounded-2xl shadow-xl">

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

    </div>
  );
}

export default Dashboard;