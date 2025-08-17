import { Heading } from "../../components";
import NotFoundImg from "../../assets/images/not-found.png";

const NotificationMessageNotFound = () => {
  return (
    <div className="flex items-center flex-col justify-center text-center mt-[100px]">
      <img
        className="mb-[28px]"
        src={NotFoundImg}
        alt="Not Found Img"
        width={160}
        height={160}
      />
      <Heading tag="h2" classList="!text-[28px] !font-semibold">
        Ma’lumot yo‘q
      </Heading>
    </div>
  );
};

export default NotificationMessageNotFound;
