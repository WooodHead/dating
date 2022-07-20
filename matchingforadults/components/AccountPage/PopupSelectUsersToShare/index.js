import { useState } from "react";
import Button from "components/Button";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import AutocompleteField from "components/Form/AutocompleteField";
import ShareUser from "./ShareUser";
import { useForm } from "react-hook-form";
import IconSearch from "components/icons/IconSearch";
import styles from "./index.module.scss";

function PopupSelectUsersToShare(
  {
    onClose
  }
) {
  const [usersList, setUsersList] = useState([
    { id: 1, thumb: '', name: 'Mr. Popper' },
    { id: 2, thumb: '', name: 'Ms. Smith' },
  ]);

  const onDeleteUser = (userId) => {
    setUsersList(arr => [...arr.filter(user => user.id !== userId)]);
  };
  
  const { control } = useForm();

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <IconButton
          className={styles['icon-close']}
          onClick={onClose}
        >
          <IconClose/>
        </IconButton>
        <div className="text-lg text-semibold text-center mb-4">
          Please select users for whom you want to share
        </div>
        <div>
          <AutocompleteField
            name="search"
            options={[]}
            control={control}
            fullWidth
            dark
            placeholder="Search"
            onSubmit={() => console.log('onSubmit')}
          />
        </div>
        <div className="text-md mb-4">
          {usersList.map(user => (
            <ShareUser
              key={user.id}
              user={user}
              onDelete={onDeleteUser}
            />
          ))}
        </div>
        <div className={styles.actions}>
          <Button
            text="Share"
            textSize="md"
            onClick={() => {}}
            disabled={!usersList.length}
          />
          <Button
            text="Cancel"
            textSize="md"
            outline
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default PopupSelectUsersToShare;
