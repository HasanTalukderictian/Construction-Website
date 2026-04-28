import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ecommerce = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/get-contents');
        // ID অনুযায়ী Descending অর্ডারে সর্ট করা
        const sortedData = res.data.sort((a, b) => b.id - a.id);
        setContents(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data", err);
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

  const formatText = (text) => {
    if (!text) return "";
    
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <br key={index} />;

      // যদি লাইনে ' – ' থাকে (পিকাবু স্টাইল বোল্ড)
      if (trimmedLine.includes(' – ')) {
        const [title, desc] = trimmedLine.split(' – ');
        return (
          <p key={index} className="mb-1">
            <span className="font-bold text-gray-900">{title}</span> – {desc}
          </p>
        );
      }

      // যদি লাইনের শুরুতে স্পেশাল আইকন থাকে (✔ বা ✅)
      if (trimmedLine.startsWith('✔') || trimmedLine.startsWith('✅')) {
        return (
          <p key={index} className="mb-1 flex items-start">
             <span className="mr-2">{trimmedLine}</span>
          </p>
        );
      }

      return <p key={index} className="mb-3">{trimmedLine}</p>;
    });
  };

  if (loading) return <div className="text-center mt-10 font-bold">Loading...</div>;

  return (
    <div className="bg-white py-10 mt-6">
      <div className="container mx-auto px-4 max-w-5xl ">
        {contents.map((item) => (
          // এখানে কন্ডিশনটি লুজ চেক (==) করা হয়েছে যাতে স্ট্রিং বা নাম্বার যাই হোক কাজ করে
          item.is_visible == 1 && (
            <div key={item.id} className="mb-12">
              {/* Name/Heading Section */}
              <h4 className="text-xl md:text-2xl font-bold text-black mb-4 border-b-2 border-gray-100 pb-3">
                {item.name}
              </h4>

              {/* Description Section */}
              <div className="text-gray-800 leading-relaxed text-sm md:text-base text-justify whitespace-pre-line">
                {formatText(item.description)}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Ecommerce;