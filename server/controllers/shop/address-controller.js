const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: "All fields (userId, address, city, pincode, phone, notes) are required.",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      notes,
      phone,
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully.",
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.error("Error in addAddress:", e);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Unable to add address.",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to fetch addresses.",
      });
    }

    const addressList = await Address.find({ userId });

    if (addressList.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No addresses found for user ID: ${userId}.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully.",
      data: addressList,
    });
  } catch (e) {
    console.error("Error in fetchAllAddress:", e);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Unable to fetch addresses.",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Both userId and addressId are required to update an address.",
      });
    }

    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found for the given userId and addressId.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: address,
    });
  } catch (e) {
    console.error("Error in editAddress:", e);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Unable to update address.",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Both userId and addressId are required to delete an address.",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found for the given userId and addressId.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (e) {
    console.error("Error in deleteAddress:", e);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Unable to delete address.",
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
