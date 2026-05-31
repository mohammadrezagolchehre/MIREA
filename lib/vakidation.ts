import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "ایمیل الزامی است")
    .email("فرمت ایمیل معتبر نیست"),
  password: z
    .string()
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "نام الزامی است"),
    lastName: z.string().min(1, "نام خانوادگی الزامی است"),
    email: z
      .string()
      .min(1, "ایمیل الزامی است")
      .email("فرمت ایمیل معتبر نیست"),
    password: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
      .regex(/[a-z]/, "حداقل یک حرف کوچک لازم است")
      .regex(/[A-Z]/, "حداقل یک حرف بزرگ لازم است")
      .regex(/[0-9]/, "حداقل یک عدد لازم است")
      .regex(/[^A-Za-z0-9]/, "حداقل یک کاراکتر خاص لازم است"),
    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
    agreeToTerms: z.boolean().refine((value) => value === true, {
      message: "پذیرش قوانین الزامی است",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
