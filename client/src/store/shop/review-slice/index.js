import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  isLoading: false,
  reviews: [],
  error: null, 
};


export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/shop/review/add`,
        formdata
      );
      return response.data; 
    } catch (error) {
      
      return rejectWithValue(
        error.response?.data || error.message || "Error adding review"
      );
    }
  }
);


export const getReviews = createAsyncThunk(
  "/order/getReviews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/review/${id}`
      );
      return response.data; 
    } catch (error) {
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
      
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null; 
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data; 
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.error = action.payload || "Error fetching reviews"; 
      })
      
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null; 
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        
        state.reviews.push(action.payload.data);
        state.error = null; 
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error adding review"; 
      });
  },
});

export default reviewSlice.reducer;
