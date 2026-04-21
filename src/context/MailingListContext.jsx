import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const MailingListContext = createContext(null);

/**
 * @typedef {{ source?: string, planInterest?: string }} MailingListOpenOptions
 */

/**
 * @returns {{
 *   isOpen: boolean,
 *   options: MailingListOpenOptions,
 *   open: (opts?: MailingListOpenOptions) => void,
 *   close: () => void,
 * }}
 */
export function useMailingList() {
  const ctx = useContext(MailingListContext);
  if (!ctx) {
    throw new Error("useMailingList must be used within MailingListProvider");
  }
  return ctx;
}

export function MailingListProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({});

  const open = useCallback((opts) => {
    setOptions(opts && typeof opts === "object" ? opts : {});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, options, open, close }),
    [isOpen, options, open, close]
  );

  return (
    <MailingListContext.Provider value={value}>
      {children}
    </MailingListContext.Provider>
  );
}
