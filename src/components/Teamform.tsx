"use client";

import React, { useState } from "react";
import RichTextEditor from "./RichTextEditor";

const TeamForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Save data to MongoDB
    try {
      // Your MongoDB save logic here
      const data = { name, description };
      console.log("Data saved:", data);

      const response = await fetch("/api/legal-information", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Data saved successfully!");
        setName("");
        setDescription("");
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleLegalInformationName = (name: any) => {
    setName(name);
  };

  return (
    <form onSubmit={handleSubmit} className="px-10 py-14">
      <div className="mb-3">
        <select
          // type="text"
          name="name"
          defaultValue=""
          onChange={(e) => setName(e.target.value)}
          required
          className="input w-full rounded bg-[#F8F8F8] px-2 py-2 text-[14px] font-normal placeholder-gray focus:border-[#555] focus:outline-none focus:ring-transparent "
        >
          <option value="" disabled>
            Select an Area Type
          </option>
          <option value="privacy-policy">privacy-policy</option>
          <option value="terms-conditions">terms-conditions</option>
          <option value="customer-support-policy">
            customer-support-policy
          </option>
          <option value="return-policy">return-policy</option>
          <option value="vulnerability-disclosure-policy">
            vulnerability-disclosure-policy
          </option>
        </select>
        {/* <label htmlFor="name">Name:</label>
        <input
          className="w-full border"
          required
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>
      <button
        type="submit"
        className="rounded-full my-3 bg-[#2563EB] px-6 py-2 text-white"
      >
        Save
      </button>
    </form>
  );
};

export default TeamForm;
