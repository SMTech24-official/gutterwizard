import { Subscription } from "./subscription.model";
import { ISubscription } from "./subscription.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { sendEmail } from "../../utils/sendEmail";
const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
const addMailIntoBD = async (payload: ISubscription) => {
  const email = await Subscription.findOne({ email: payload.email });
  const isValidEmail = validateEmail(payload.email);
  if (!isValidEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid email format");
  }
  if (email) {
    throw new AppError(httpStatus.CONFLICT, "this email is already in use");
  }
  const result = await Subscription.create(payload);
  return result;
};

// get all subscriptions

const getAllSubscriptions = async (query: any) => {
  const { page = 1, limit = 10 } = query; // Default to page 1 and 10 subscriptions per page

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  // Fetch paginated subscriptions
  const result = await Subscription.find()
    .skip(skip) // Skip the documents based on the page
    .limit(Number(limit)) // Limit the number of documents returned
    .sort({ createdAt: -1 }); // Optionally, sort by creation date (or any other field)

  // Count the total number of subscriptions
  const totalSubscriptions = await Subscription.countDocuments();

  return {
    totalSubscriptions,
    currentPage: Number(page),
    totalPages: Math.ceil(totalSubscriptions / limit),
    subscriptions: result,
  };
};

const sendMailMultipleUser = async (payload: {
  email: string[];
  text: string;
  subject: string;
}) => {
    const htmlContent = `
    <html>
      <body>
        <h1>${payload.subject}</h1>
        <p>${payload.text}</p>
        <p>Best regards,</p>
        <p>Gutter wizerd</p>
      </body>
    </html>
  `;
  await sendEmail(payload.email, htmlContent, payload.subject);
};
export const SubscriptionService = {
  addMailIntoBD,
  getAllSubscriptions,
  sendMailMultipleUser,
};
