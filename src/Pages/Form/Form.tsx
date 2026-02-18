import { useState } from "react";

const Form = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [subject, setSubject] = useState("");
  //   const [list, setList] = useState([]);

  const list:any = [];
  const handleSubmit = (e:any) => {
    e.preventDefault();

    const data = {
      name,
      rollNumber,
      subject,
    };
    console.log(data);
    // setList(data);
    // setList((prev) => [...prev, data]);
    list.push(data)
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Name</label>
        <input
          type="text"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="">Roll Number</label>
        <input
          type="number"
          name="number"
          required
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />
        <label htmlFor="">Subject</label>
        <input
          type="text"
          name="subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <table>
        <thead>
          <th>
            <td>Name</td>
            <td>Roll Number</td>
            <td>Subject</td>
          </th>
        </thead>
        <tbody>
          {list?.map((x: any) => (
            <tr>
              <td>{x.name}</td>
              <td>{x.rollNumber}</td>
              <td>{x.subject}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Form;
