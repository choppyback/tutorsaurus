import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
      <img src={BASE_URL + tutor.profile_pic} style={{ width: "150px" }} />
      <h2>{tutor.name}</h2>
      <p>
        <strong>Faculty:</strong> {tutor.faculty}
      </p>
      <p>
        <strong>Year of Studies:</strong> {tutor.year}
      </p>
      <p>
        <strong>Modules Taught:</strong> {tutor.modules_taught}
      </p>
      <p>
        <strong>Hourly Rate:</strong> ${tutor.hourly_rate}
      </p>
      <p>
        <strong>Rating:</strong> {tutor.rating} ⭐
      </p>
      <p>
        <strong>Bio:</strong> {tutor.bio}
      </p>
    </div>
  );
}

export default TutorProfile;
