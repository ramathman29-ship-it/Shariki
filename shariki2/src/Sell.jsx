import { useState } from "react";

export default function Sell({ homes, setHomes }) {
  const [newHome, setNewHome] = useState({
    address: "",
    location: "",
    // project: "",
    area: "",
    status: "sell",
    price: "",
    description: "",
    condition: "green",
    type: "",
    available_percentage: "100",
    type_request: "fullSell",
    // suffixes: [
    //   // مثال على suffixes
    //   { title: "", description: "" }
    // ]
  });

  // const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHome({ ...newHome, [name]: value });
  };

  // const handleSuffixChange = (index, field, value) => {
  //   const updated = [...newHome.suffixes];
  //   updated[index][field] = value;
  //   setNewHome({ ...newHome, suffixes: updated });
  // };

  // const addSuffix = () => {
  //   setNewHome({ ...newHome, suffixes: [...newHome.suffixes, { title: "", description: "" }] });
  // };

  // const handleImagesChange = (e) => {
  //   setImages([...e.target.files]);
  // };

  const addHouse = async (e) => {
    e.preventDefault();

    if (!newHome.address || !newHome.location || !newHome.price) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // جميع الحقول المطلوبة
      formData.append("address", newHome.address);
      formData.append("location", newHome.location);
      formData.append("project", newHome.project);
      formData.append("area", newHome.area);
      formData.append("status", newHome.status);
      formData.append("price", newHome.price);
      formData.append("description", newHome.description);
      formData.append("condition", newHome.condition);
      formData.append("type", newHome.type);
      formData.append("available_percentage", newHome.available_percentage);
      formData.append("type_request", newHome.type_request);

      // الصور
      // images.forEach((img, i) => formData.append(`images[${i}]`, img));

      // اللواحق
      // newHome.suffixes.forEach((s, i) => {
      //   formData.append(`suffixes[${i}][title]`, s.title);
      //   formData.append(`suffixes[${i}][description]`, s.description);
      // });

      const res = await fetch("http://127.0.0.1:8000/api/properties", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (!res.ok) {
        alert(data.message || "Failed to create property!");
        return;
      }

      setHomes([...homes, data.property]);
      alert(data.message || "Property added successfully!");

      // إعادة تهيئة الفورم
      setNewHome({
        address: "",
        location: "",
        // project: "",
        area: "",
        status: "sell",
        price: "",
        description: "",
        condition: "green",
        type: "",
        available_percentage: "100",
        type_request: "fullSell",
        // suffixes: [{ title: "", description: "" }],
      });
      // setImages([]);

    } catch (err) {
      console.error("Error:", err);
      alert("Error connecting to server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Add New Property</h2>

      <form onSubmit={addHouse} className="add-home-form">
        <input type="text" name="address" placeholder="Address" value={newHome.address} onChange={handleInputChange} required />
        <input type="text" name="location" placeholder="Location" value={newHome.location} onChange={handleInputChange} required />
        {/* <input type="text" name="project" placeholder="Project" value={newHome.project} onChange={handleInputChange} /> */}
        <input type="number" name="area" placeholder="Area" value={newHome.area} onChange={handleInputChange} />
        <input type="number" name="price" placeholder="Price" value={newHome.price} onChange={handleInputChange} required />
        <input type="text" name="description" placeholder="Description" value={newHome.description} onChange={handleInputChange} />
        <input type="text" name="type" placeholder="Type" value={newHome.type} onChange={handleInputChange} />

        <select name="status" value={newHome.status} onChange={handleInputChange}>
          <option value="sell">Sell</option>
          <option value="rent">Rent</option>
        </select>

        <select name="condition" value={newHome.condition} onChange={handleInputChange}>
          <option value="green">Good</option>
          <option value="yellow">Average</option>
          <option value="red">Bad</option>
        </select>

        <select name="type_request" value={newHome.type_request} onChange={handleInputChange}>
          <option value="fullSell">Full Sell</option>
          <option value="partialSell">Partial Sell</option>
        </select>

        <input type="number" name="available_percentage" placeholder="Available Percentage" value={newHome.available_percentage} onChange={handleInputChange} />

        {/* الصور */}
        {/* <input type="file" multiple onChange={handleImagesChange} /> */}

        {/* اللواحق */}
        {/* {newHome.suffixes.map((s, i) => (
          <div key={i}>
            <input type="text" placeholder="Suffix Title" value={s.title} onChange={(e) => handleSuffixChange(i, "title", e.target.value)} />
            <input type="text" placeholder="Suffix Description" value={s.description} onChange={(e) => handleSuffixChange(i, "description", e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={addSuffix}>Add Suffix</button> */}

        <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Property"}</button>
      </form>
    </>
  );
}