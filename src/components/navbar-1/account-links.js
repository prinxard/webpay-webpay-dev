import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import { FiUser, FiLogIn } from "react-icons/fi";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { logout } from "../../redux/authentication/auth.actions";

const AccountLinks = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { auth } = useSelector(
    (state) => ({
      auth: state.authentication.auth,
    }),
    shallowEqual
  );

  const items = [
    // {
    //   url: '/extras/user-profile',
    //   icon: <FiUser size={18} className="stroke-current" />,
    //   name: 'Profile',
    //   badge: null,
    // },
  ];

  useEffect(() => {
    if (!auth) {
      LogoutUser();
    }
  }, [auth]);

  const LogoutUser = () => {
    router.reload();
    dispatch(logout());
  };

  return (
    <div className="flex flex-col w-full">
      <ul className="list-none">
        {items.map((item, i) => (
          <li key={i} className="dropdown-item">
            <Link href={item.url}>
              <a className="flex flex-row items-center justify-start h-10 w-full px-2">
                {item.icon}
                <span className="mx-2">{item.name}</span>
                {item.badge && (
                  <span
                    className={`uppercase font-bold text-center p-0 leading-none text-2xs h-4 w-4 inline-flex items-center justify-center rounded-full ${item.badge.color} ml-auto`}
                  >
                    {item.badge.number}
                  </span>
                )}
              </a>
            </Link>
          </li>
        ))}

        <button
          className="dropdown-item flex flex-row items-center justify-start h-10 w-full px-2 "
          onClick={LogoutUser}
        >
          <FiLogIn size={18} className="stroke-current" />
          <span className="mx-2">Logout</span>
        </button>
      </ul>
    </div>
  );
};

export default AccountLinks;
