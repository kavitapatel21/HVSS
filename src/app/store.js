import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/loginSlice";
import subcodeReducer from "../features/subcodeSlice";
import codeReducer from "../features/homeSearchSlice";
import userReducer from "../features/userSlice";
import importReducer from "../features/importFileSlice";
import vendorReducer from "../features/vendorSlice";

export default configureStore({
    reducer: {
        user: loginReducer,
        subcodes: subcodeReducer,
        codeDetails: codeReducer,
        users: userReducer,
        extractedData: importReducer,
        vendors: vendorReducer,
    },
});