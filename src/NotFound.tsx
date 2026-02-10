import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                {/* Animated Blood Drop Icon */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="text-8xl mb-6 flex justify-center text-red-600"
                >
                    🩸
                </motion.div>

                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-9xl font-extrabold text-gray-200 absolute -z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                >
                    404
                </motion.h1>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops! The drop is lost.</h2>
                    <p className="text-gray-500 mb-8">
                        The page you are looking for might have been moved, deleted, or never existed in our bank.
                    </p>

                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-colors"
                        >
                            Back to Homepage
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;