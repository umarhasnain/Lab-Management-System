'use client'
import { useState } from "react";
import { Card, CardContent, Typography, Button, TextField, Grid, Chip, Divider, Box } from "@mui/material";
import { FaSearch, FaVials, FaInfoCircle } from "react-icons/fa";
import Navbar from "@/components/Navbar";


const testData = [
  { id: 1, name: "Complete Blood Count (CBC)", price: "1500 PKR", details: "A complete blood count (CBC) test gives important information about the kinds and numbers of cells in the blood." },
  { id: 2, name: "Liver Function Test (LFT)", price: "2000 PKR", details: "LFTs help determine the health of your liver by measuring the levels of proteins, liver enzymes, and bilirubin." },
  { id: 3, name: "Kidney Function Test (KFT)", price: "1000 PKR", details: "KFTs measure different substances in your blood and urine to check how well your kidneys are working." },
  { id: 4, name: "Lipid Profile", price: "1700 PKR", details: "A lipid profile test measures the amount of cholesterol and fats in your blood." },
  { id: 5, name: "Thyroid Panel", price: "3000 PKR", details: "A thyroid panel checks the function of the thyroid gland by measuring different hormone levels in the blood." },
];

export default function Tests() {
  const [search, setSearch] = useState("");

  const filteredTests = testData.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <div>
<Navbar/>
     <div className="max-w-7xl mx-auto py-12 px-8 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="text-[#00b4d8] font-bold mb-8 flex items-center gap-3">
        <FaVials className="text-3xl" /> Available Tests
      </Typography>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-5 rounded-xl mb-8 mt-4 shadow-md border border-gray-200">
        <FaSearch className="text-gray-500 text-xl" />
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Test Cards */}
      <Grid container spacing={4}>
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test.id}>
              <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 p-5 rounded-xl border border-gray-200 bg-white flex flex-col justify-between h-full">
                <CardContent className="flex flex-col flex-grow text-center">
                  <Typography variant="h6" className="text-gray-900 font-semibold mb-2">
                    {test.name}
                  </Typography>
                  <Typography className="text-gray-600 mb-4 text-sm flex-grow">
                    {test.details}
                  </Typography>
                </CardContent>
                <Divider className="my-4" />
                <Box className="flex justify-between items-center p-3">
                  <Chip label={test.price} className="bg-[#00b4d8] text-white font-bold px-3 py-1 text-lg" />
                  <Button
                    variant="contained"
                    color="primary"
                    className="py-2 rounded-lg text-lg shadow-md"
                    style={{ backgroundColor: "#00b4d8" }}
                    startIcon={<FaInfoCircle />}
                  >
                    Book Now
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography className="text-gray-500 text-center w-full">No tests found.</Typography>
        )}
      </Grid>
    </div>
   </div>
  );
}
