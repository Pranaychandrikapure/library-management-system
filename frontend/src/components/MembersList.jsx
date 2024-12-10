import { useEffect, useState } from 'react';
import { fetchAllMembers } from '../api';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMembers = async () => {
      try {
        const fetchedMembers = await fetchAllMembers();
        setMembers(fetchedMembers); // Update state with the list of members
      } catch (error) {
        setError('Failed to fetch members'); // Set error if fetching fails
      }
    };

    getMembers();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Members List</h2>
      {members.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Sr. No.</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">Phone</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member.id}>
                <th scope="row">{index + 1}</th>
                <td>{member.name}</td> {/* Assuming `firstName` in your member object */}
                <td>{member.email}</td>
                <td>{member.address}</td>
                <td>{member.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No members found</p>
      )}
    </div>
  );
};

export default MemberList;
