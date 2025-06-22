import React from "react";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";

const Dashboard = () => {
  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <>
      <NavBar />
      <SearchBar onSearch={handleSearch} />
    </>
  );
};

export default Dashboard;
