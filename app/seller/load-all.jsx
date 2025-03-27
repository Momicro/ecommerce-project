"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { assets } from "@/assets/assets";

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Earphone");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("productsDummyData");
    for (let i = 0; i < productsDummyData.length; i++) {
      const productData = productsDummyData[i];

      const imageInput = document.createElement("input");
      imageInput.type = "file";
      imageInput.accept = "image/*";

      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("category", productData.category);
      formData.append("price", productData.price);
      formData.append("offerPrice", productData.offerPrice);

      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      try {
        const token = await getToken();
        const { data } = await axios.post("/api/product/add", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.success) {
          toast.success(data.message);
          setFiles([]);
          setName("");
          setDescription("");
          setCategory("Earphone");
          setPrice("");
          setOfferPrice("");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  id={`image${index}`}
                  hidden
                />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index])
                      : assets.upload_area
                  }
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          ADD
        </button>
      </form>

      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;
