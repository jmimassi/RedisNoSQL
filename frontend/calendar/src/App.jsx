import Axios from "axios";
import dayjs from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { useState } from "react";
import CustomDay from "./components/calendar";
dayjs.extend(isBetweenPlugin);
function App() {
  const [value, setValue] = useState(dayjs("2022-12-08"));

  const [course, setCourse] = useState([]);

  function fetchdata(date) {
    Axios.get(`http://localhost:8000/${date}`).then((donnee) => {
      setCourse(donnee.data);
      console.log("response", course);
      return course;
    });
  }

  return (
    <div className="App">
      <CustomDay fetchdata={fetchdata} value={value} setValue={setValue} />
      {course.map((courses, index) => (
        <div className="flex justify-center" key={index}>
          Cours: {courses.cours}, Heure du cours: {courses.time}
        </div>
      ))}
    </div>
  );
}

export default App;
