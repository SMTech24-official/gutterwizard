import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { Support } from "./support.model";
import { ISupports } from "./support.interface";

const createSupport=async(payload:any)=>{
    const response = await Support.create(payload);
    return response;
}

const getAllSupportRequests = async (page: number = 1, limit: number = 10,query:any) => {

    const skip = (page - 1) * limit;
  const baseQuery:Partial<ISupports>={}
  if(query.status){
    baseQuery.status=query.status
  }
    const supportRequests = await Support.find(baseQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
    return supportRequests;
  };

  const getSingleSupportRequest = async (id: string) => {
    const supportRequest = await Support.findById(id);
  
    if (!supportRequest) {
      throw new Error("Support request not found");
    }
  
    return supportRequest;
  };

  // delete support

const deleteSupportRequest = async (id: string) => {
    const supportRequest = await Support.findByIdAndDelete(id);
  
    if (!supportRequest) {
      throw new Error("Support request not found");
    }
  
    return supportRequest;
  };
  
  // update support and send mail notification

const updateSupportRequestAndSendNotification = async (id: string) => {
    const support = await Support.findById(id);
    if (!support) {
      throw new AppError(httpStatus.NOT_FOUND, "Support not found");
    }
 
    const supportRequest = await Support.findByIdAndUpdate(
      id,
      { status: "resolved" }, // change status to resolved
      { new: true }
    );
  
    if (!supportRequest) {
      throw new Error("Support request not found");
    }
  
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Support Request Resolved</h2>
      <p>Dear ${support.email || "User"},</p>
      <p>We are pleased to inform you that your support request has been resolved. Our team has carefully reviewed your issue, and we hope that the resolution meets your expectations.</p>
      <p>If you have any further questions or need additional assistance, please don't hesitate to reply to this email or contact our support team.</p>
      <p>Thank you for reaching out to us, and we appreciate your patience.</p>
      <hr />
      <p style="color: #555;">Best regards,</p>
      <p style="color: #555;">The Support Team</p>
      <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  `;
  
    // send email notification
    sendEmail(support?.email, html, "Your Support Request Has Been Resolved");
  
    return supportRequest;
  };
export const SupportService={
    createSupport,
    getAllSupportRequests,
    getSingleSupportRequest,
    deleteSupportRequest,
    updateSupportRequestAndSendNotification
}