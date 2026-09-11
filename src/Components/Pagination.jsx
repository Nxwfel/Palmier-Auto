import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-6 mb-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-700 hover:text-white transition-all font-medium text-sm"
      >
        Précédent
      </motion.button>
      <div className="flex items-center gap-2">
        <span className="text-neutral-400 text-sm font-medium">
          Page <span className="text-white">{currentPage}</span> sur <span className="text-white">{totalPages}</span>
        </span>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-700 hover:text-white transition-all font-medium text-sm"
      >
        Suivant
      </motion.button>
    </div>
  );
};

export default Pagination;
