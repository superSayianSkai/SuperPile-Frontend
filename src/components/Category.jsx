import { useContext, useRef, useState, useEffect } from "react";
import { StateContext } from "../context/SupaPileContext";
import { useFetchCategory } from "../tanstack-query-hooks/useFetchCategory";
import useStateStore from "../zustard/useStateStore";
import useCreateCategory from "../tanstack-query-hooks/useCreateCategory";
import useDeleteCategory from "../tanstack-query-hooks/useDeleteCategory";

const Category = () => {
  const { tick, setTheTick } = useContext(StateContext);
  const { setCategory } = useStateStore();
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    categoryName: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState("");

  const pressSomething = (e) => {
    setTheTick(e);
    setCategory(e);
  };

  const { data } = useFetchCategory();
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: deleteCategory, isLoading: isDeleting } = useDeleteCategory();
  let category = data?.data.categories || [];

  const [showArrow, setShowArrow] = useState(false);
  const categoryRef = useRef();

  const handleAddCategory = (e) => {
    e.stopPropagation();
    setShowAddInput(true);
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    setIsCreating(true);
    createCategory(
      { categoryName: newCategoryName.trim() },
      {
        onSuccess: (response) => {
          setNewCategoryName("");
          setShowAddInput(false);
          setIsCreating(false);
          // Optionally select the new category
          const createdCategoryName = response.data?.categoryName;
          if (createdCategoryName) {
            pressSomething(createdCategoryName);
          }
        },
        onError: (error) => {
          setIsCreating(false);
          console.error("Error creating category:", error);
          // You can add toast notification here
        },
      }
    );
  };

  const handleCancelAdd = () => {
    setShowAddInput(false);
    setNewCategoryName("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreateCategory();
    } else if (e.key === "Escape") {
      handleCancelAdd();
    }
  };

  // Right-click context menu handlers
  const handleRightClick = (e, categoryName) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't show context menu for 'all' category
    if (categoryName.toLowerCase() === "all") {
      return;
    }

    // Calculate responsive positioning
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = 150; // Approximate context menu width
    const menuHeight = 50; // Approximate context menu height

    let x = e.clientX;
    let y = e.clientY;

    // Adjust position if menu would go off-screen
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10;
    }
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10;
    }

    // Ensure minimum distance from edges on mobile
    if (viewportWidth < 640) {
      // sm breakpoint
      x = Math.max(10, Math.min(x, viewportWidth - menuWidth - 10));
      y = Math.max(10, Math.min(y, viewportHeight - menuHeight - 10));
    }

    setContextMenu({
      show: true,
      x,
      y,
      categoryName,
    });
  };

  const handleDeleteClick = () => {
    setCategoryToDelete(contextMenu.categoryName);
    setShowDeleteConfirm(true);
    setContextMenu({ show: false, x: 0, y: 0, categoryName: "" });
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete, {
        onSuccess: () => {
          // If the deleted category was selected, switch to 'all'
          if (tick === categoryToDelete) {
            pressSomething("all");
          }
          setShowDeleteConfirm(false);
          setCategoryToDelete("");
        },
        onError: (error) => {
          console.error("Failed to delete category:", error);
          // You can add toast notification here
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete("");
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ show: false, x: 0, y: 0, categoryName: "" });
    };

    if (contextMenu.show) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [contextMenu.show]);

  useEffect(() => {
    if (!categoryRef.current) return;
    const el = categoryRef.current;
    const handleScroll = () => {
      // Show arrow when there's more content below (scrollable content)
      const hasScrollableContent = el.scrollHeight > el.clientHeight;
      const isNotAtBottom =
        el.scrollTop < el.scrollHeight - el.clientHeight - 20;
      setShowArrow(hasScrollableContent && isNotAtBottom);
    };
    el.addEventListener("scroll", handleScroll);
    // Also check on resize or content change
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(el);
    handleScroll(); // Initial check
    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [category]); // Add category as dependency to recheck when categories change

  console.log("formula 1");
  console.log(category.length);

  return (
    <>
      <div
        ref={categoryRef}
        className={`border-[1px] dark:border-gray-700 bg-[#F4F4F4] dark:bg-[#191919] text-black ${
          category.length > 2 &&
          "w-[200px] max-w-[200px] sm:w-[300px] sm:max-w-[300px]"
        } flex-wrap max-h-[155px] items-center overflow-y-scroll scroll-smooth scroll overflow-hidden -left-2 z-[2] rounded-2xl flex  gap-2 absolute top-6 cursor-pointer p-3 shadow-2xl"`}
      >
        {category
          ?.slice()
          .sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : 0))
          .map((c, index) => {
            return (
              <div
                onClick={() => pressSomething(c)}
                onContextMenu={(e) => handleRightClick(e, c)}
                onMouseEnter={(e) => {
                  if (c !== "all") {
                    const deleteBtn = e.currentTarget.querySelector('.delete-btn');
                    if (deleteBtn) deleteBtn.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (c !== "all") {
                    const deleteBtn = e.currentTarget.querySelector('.delete-btn');
                    if (deleteBtn) deleteBtn.style.opacity = '0';
                  }
                }}
                key={index}
                className={`flex relative justify-between items-center select-none user-select-none ${
                  tick === c
                    ? "bg-gradient-to-r from-[#ff66b2] to-[#ff8c00] text-white"
                    : "bg-[#E3E3E3] text-black"
                } hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] hover:text-white font-medium rounded-md capitalize px-2 py-1`}
                style={{
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  userSelect: "none",
                  WebkitTouchCallout: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <span className="select-none pointer-events-none">
                  <h1 className="text-[.8rem] lowercase select-none w-[100%] pointer-events-none">
                    {c}
                  </h1>
                </span>
                {/* Delete button - visible beside category on mobile, hover on desktop */}
                {c !== "all" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategoryToDelete(c);
                      setShowDeleteConfirm(true);
                    }}
                    className="delete-btn flex justify-center items-center transition-all duration-200 z-10
                               max-md:relative max-md:opacity-100 max-md:ml-2 max-md:w-4 max-md:h-4 max-md:bg-transparent max-md:hover:bg-red-100 max-md:rounded
                               md:absolute md:-top-1 md:-right-1 md:w-5 md:h-5 md:bg-red-500 md:hover:bg-red-600 md:rounded-full md:shadow-md md:hover:shadow-lg md:text-white"
                    style={{ opacity: window.innerWidth >= 768 ? 0 : 1 }}
                    title="Delete category"
                  >
                    <i className="bi bi-x md:text-xs hidden md:block"></i>
                    <i className="bi bi-trash text-red-600 text-[10px] md:hidden"></i>
                  </button>
                )}
                {tick === c && (
                  <i className="bi bi-check2 text-[.8rem] select-none"></i>
                )}
              </div>
            );
          })}

        {/* Add Category Input */}
        {showAddInput ? (
          <div
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking input area
            className="flex items-center gap-1 bg-[#E3E3E3] dark:bg-[#2a2a2a] rounded-md px-2 py-1"
          >
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value.toLowerCase())}
              onKeyDown={handleKeyPress}
              placeholder="Category name"
              className="bg-transparent text-[.8rem] outline-none w-20 text-black dark:text-white placeholder-gray-500"
              maxLength={17}
              autoFocus
              disabled={isCreating}
            />
            <button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim() || isCreating}
              className="text-green-600 hover:text-green-700 text-[.7rem] disabled:opacity-50"
            >
              {isCreating ? (
                <i className="bi bi-hourglass-split animate-spin"></i>
              ) : (
                <i className="bi bi-check2"></i>
              )}
            </button>
            <button
              onClick={handleCancelAdd}
              className="text-red-600 hover:text-red-700 text-[.7rem]"
              disabled={isCreating}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        ) : (
          /* Add+ Button */
          <div
            onClick={handleAddCategory}
            className="flex justify-center items-center hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] hover:text-white bg-[#E3E3E3] dark:bg-[#2a2a2a] font-medium text-black dark:text-white rounded-md px-2 py-1 cursor-pointer transition-colors"
          >
            <span>
              <h1 className="text-[1rem]">
                <i className="bi bi-plus"></i>
              </h1>
            </span>
          </div>
        )}

        {showArrow && (
          <div className="flex absolute right-2 bottom-2 justify-center">
            <i className="bi bi-chevron-double-down text-sm dark:text-white bouncing-arrow bi bi-arrow-down animate-bounce "></i>
          </div>
        )}
      </div>

      {/* Context Menu - Responsive */}
      {contextMenu.show && (
        <div
          className="fixed bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-600 rounded-md shadow-lg py-1 z-[1000] min-w-[140px] sm:min-w-[150px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDeleteClick}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm transition-colors duration-150"
          >
            <i className="bi bi-trash text-xs sm:text-sm"></i>
            <span className="text-xs sm:text-sm font-medium">
              Delete Category
            </span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal - Fully Responsive */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001] p-4">
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm mx-4 shadow-xl">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black dark:text-white">
              Delete Category
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
              Are you sure you want to delete the category &quot;
              {categoryToDelete}&quot;? All piles in this category will be moved
              to the &quot;all&quot; category.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <button
                onClick={handleCancelDelete}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 order-2 sm:order-1"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-red-600 text-white hover:bg-red-700 rounded-md flex items-center justify-center gap-2 transition-colors duration-150 order-1 sm:order-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <i className="bi bi-hourglass-split animate-spin text-xs sm:text-sm"></i>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash text-xs sm:text-sm"></i>
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Category;
