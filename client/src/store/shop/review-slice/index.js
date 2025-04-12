import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  isLoading: false,
  reviews: [],
  error: null, // To store error messages
};

// Add a review
export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/shop/review/add`,
        formdata
      );
      return response.data; // On success, return the data
    } catch (error) {
      // Handle errors if the request fails
      return rejectWithValue(
        error.response?.data || error.message || "Error adding review"
      );
    }
  }
);

// Get reviews for a product
export const getReviews = createAsyncThunk(
  "/order/getReviews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/review/${id}`
      );
      return response.data; // On success, return the data
    } catch (error) {
      // Handle errors if the reviews can't be fetched
      return rejectWithValue(
        error.response?.data || error.message || "Error fetching reviews"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get reviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Reset error on new request
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data; // Assign fetched reviews
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.error = action.payload || "Error fetching reviews"; // Assign error
      })
      // Add review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Reset error on new request
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally, you can append the new review to the reviews array
        state.reviews.push(action.payload.data);
        state.error = null; // Reset error on success
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error adding review"; // Handle error
      });
  },
});

export default reviewSlice.reducer;
