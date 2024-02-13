import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState<any | null>(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`YOUR_METADATA_API_ENDPOINT`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const metadata = await response.json();
          setUserMetadata(metadata);
        } else {
          throw new Error("Failed to fetch user metadata");
        }
      } catch (error) {
        console.error("Error fetching user metadata:", error);
      }
    };

    if (isAuthenticated) {
      getUserMetadata();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return isAuthenticated ? (
    <div>
      <img src={user?.picture} alt={user?.name} />
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <h3>User Metadata</h3>
      {userMetadata ? (
        <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
      ) : (
        "No user metadata defined"
      )}
    </div>
  ) : null;
};

export default Profile;