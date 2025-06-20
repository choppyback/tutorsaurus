import React from "react";
import TopBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";

const Dashboard = () => {
  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <>
      <TopBar />
      <SearchBar onSearch={handleSearch} />
    </>
  );
};

export default Dashboard;
