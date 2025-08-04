import { string, object } from "yup"

export const LoginSchema = object({
    name: string().required("Name kiritish majburiy").min(2, "Minimum 2ta soz bo'lishi kerak"),
    password: string().required("Password kiritish majburiy").min(6, "Minimum 6ta harf bo'lishi kerak")
})