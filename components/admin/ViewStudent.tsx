import GlobalContext from "../../context/GlobalContext";
import { CSSTransition } from "react-transition-group";
import animate from "../../styles/animate.module.css";
import styles from "../../styles/Signup.module.scss";
import { CgTrashEmpty } from "react-icons/cg";
import { MdClose } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useContext } from "react";


const ViewStudent = ({ show }: { show: boolean }) => {
  const { setShowDetail, setShowAddModal } = useContext(GlobalContext);
  const labels = [
    { title: "Matric No", value: "SCI17CSC031" },
    { title: "Email", value: "incrediblechamp1@gmail.com" },
    {
      title: "Address",
      value: "Opp. New Government House, Rayfield Jos, Plateau State, Nigeria",
    },
    { title: "School", value: "Federal University Lokoja" },
    { title: "Department", value: "Computer Science" },
    { title: "Level", value: "400" },
    { title: "Sex", value: "Male" },
    { title: "Organisation", value: "nHub Foundation, Jos" },
  ];

  return (
    <>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={show}
        timeout={{ enter: 400, exit: 1000 }}
        classNames={{
          enter: "",
          enterActive: animate.fadeEnterActive,
          exit: "",
          exitActive: animate.fadeExitActive,
        }}
      >
        <div className={styles.backDrop}></div>
      </CSSTransition>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={show}
        timeout={{ enter: 400, exit: 1000 }}
        classNames={{
          enter: "",
          enterActive: animate.animateEnterActive,
          exit: "",
          exitActive: animate.animateExitActive,
        }}
      >
        <div className={styles.addStudent}>
          <div className="sm:p-5 lg:p-5">
            <div className="flex justify-between w-full">
              <div className="">
                <MdClose
                  onClick={() => setShowDetail(false)}
                  size={"1.5rem"}
                  className="cursor-pointer p-0 m-0 hover:text-red-500"
                />
              </div>
              <div className="flex justify-between mr-2">
                <FaEdit
                  size={"1.5rem"}
                  onClick={() => {
                    setShowDetail(false);
                    setShowAddModal(true);                
                  }}
                  className="cursor-pointer mr-2 hover:text-blue-500"
                />
                <CgTrashEmpty
                  size={"1.5rem"}
                  className="cursor-pointer hover:text-red-500"
                />
              </div>
            </div>

            <h1>Vicolas Akoh</h1>
            <div className="flex flex-row flex-wrap w-full mt-2">
              <div className={styles.passportSt}>
                <img src="../images/Passport.jpg" alt="passport" />
              </div>
              <div className={styles.infoSection}>
                {labels.map((lbl) => (
                  <div>
                    <span className="text-gray-500 w-1/4 uppercase">
                      {lbl.title}
                    </span>
                    <span className="font-bold text-start w-3/4">
                      {lbl.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default ViewStudent;
