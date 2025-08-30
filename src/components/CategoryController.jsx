import { useContext, useRef } from "react";
import { StateContext } from "../context/SupaPileContext";
import Category from "./Category";
import useCategoryStore from "../zustard/useCategoryStore";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { useFetchCategory } from "../tanstack-query-hooks/useFetchCategory";
const CategoryController = ({ id }) => {
  const { closeModal, toggleCategory, modals } = useCategoryStore();
  const { tick } = useContext(StateContext);
  const toogleRef = useRef();
  const { isLoading } = useFetchCategory();
  useOnClickOutside(closeModal, toogleRef, id);
  return (
    <div
      ref={toogleRef}
      onClick={() => toggleCategory(id)}
      className="user-select-none flex gap-1 items-center justify-center cursor-pointer relative"
    >
      <h2 className="font-bold user-select-none text-[1rem] md:text-[.8rem] capitalize">
        {tick}
      </h2>
      <i
        className={`text-[1rem] transition-transform duration-300 ease-in-out ${
          modals.pickCategory ? "bi bi-x rotate-180" : "bi bi-plus rotate-0"
        }`}
      ></i>
      {modals.pickCategory && !isLoading && <Category />}
    </div>
  );
};

export default CategoryController;
