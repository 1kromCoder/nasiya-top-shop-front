import type { FC } from "react";
import type { TextType } from "../@types/Text";

const Text: FC<TextType> = ({ classList, children, onClick }) => {
  return (
    <p className={`${classList} font-medium text-[16px]`} onClick={onClick}>
      {children}
    </p>
  );
};

export default Text;
