"use client"
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastMessage = (msg: string, type: string) => {
  if (msg) {
    if (msg == undefined || (typeof msg == "string" && msg == "")) {
      return false;
    }
    toast.dismiss();

    if (type == "s") {
      toast.success(msg);
    } else if (type == "e") {
      toast.error(msg);
    } else if (type == "w") {
      toast.warn(msg);
    } else if (type == "i") {
      toast.info(msg);
    } else {
      toast.error(msg);
    }
  }
};