import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../api";

function TutorProfile({ id: propId }) {
  const [tutor, setTutor] = useState(null);
  const id = propId;

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/profile/${id}`);
        setTutor(res.data);
      } catch (err) {
        console.error("Error fetching tutor profile", err);
      }
    };

    fetchTutor();
  }, [id]);

  if (!tutor) return <p>Loading profile...</p>;

  return (
    <div className="tutor-profile">
      {tutor.profile_pic && (
        <img
          src={`${BASE_URL}${tutor.profile_pic}`}
          alt="Tutor"
          style={{ width: "150px", borderRadius: "8px" }}
        />
      )}
      <h2>{tutor.name}</h2>
      <p>
        <strong>Email:</strong> {tutor.email}
      </p>
      <p>
        <strong>Faculty:</strong> {tutor.faculty}
      </p>
      <p>
        <strong>Year of Study:</strong> {tutor.year_of_study}
      </p>
      <p>
        <strong>Modules Taught:</strong>{" "}
        {tutor.modules_taught || "Not specified"}
      </p>
      <p>
        <strong>Hourly Rate:</strong>{" "}
        {tutor.hourly_rate ? `$${tutor.hourly_rate}` : "Not provided"}
      </p>
      <p>
        <strong>Rating:</strong>{" "}
        {tutor.rating ? `${tutor.rating} ⭐` : "No ratings yet"}
      </p>
      <p>
        <strong>Bio:</strong> {tutor.bio || "No bio available"}
      </p>

      {tutor.availability && (
        <>
          <h3>Availability</h3>
          <ul>
            {Object.entries(tutor.availability).map(([day, time]) => (
              <li key={day}>
                {day}: {time.start} - {time.end}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default TutorProfile;
