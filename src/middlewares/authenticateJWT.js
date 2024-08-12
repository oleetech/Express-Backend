// প্রয়োজনীয় প্যাকেজগুলো ইমপোর্ট করছি
const jwt = require('jsonwebtoken'); // JWT যাচাইয়ের জন্য
const User = require('../entities/User'); // ব্যবহারকারীর তথ্য পাওয়ার জন্য User মডেল

// মিডলওয়্যার ফাংশন যা রুটগুলো রক্ষা করতে ব্যবহৃত হয়
const authenticateJWT = async (req, res, next) => {
    // Authorization হেডার থেকে টোকেন এক্সট্রাক্ট করছি
    const token = req.headers.authorization && 
                  req.headers.authorization.split(' ')[1];
                  // এখানে আমরা Authorization হেডার চেক করছি
                  // তারপর split(' ') করে স্পেস দিয়ে টোকেন বের করছি
                  // যেমন "Bearer <your-jwt-token>" হলে, এটি "<your-jwt-token>" বের করবে

    // যদি টোকেন না থাকে, তাহলে 401 (Unauthorized) রেসপন্স দিবো
    if (!token) {
        return res.status(401).json({ message: 'No authentication token provided.' });
        // বার্তা পাঠাচ্ছে যে কোন অ্যান্থেন্টিকেশন টোকেন প্রদান করা হয়নি
    }

    try {
        // টোকেন যাচাই করছি সিক্রেট কির মাধ্যমে
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        // JWT.verify() ফাংশন টোকেন যাচাই করে এবং ডিকোড করে

        // টোকেন দ্বারা নির্ধারিত ব্যবহারকারী খুঁজছি
        const user = await User.findOne({ where: { id: decoded.id } });
        // ডিকোড করা টোকেন থেকে ব্যবহারকারীর আইডি নিয়ে ব্যবহারকারী খুঁজছি

        // যদি ব্যবহারকারী না থাকে, তাহলে 401 (Unauthorized) রেসপন্স দিবো
        if (!user) {
            return res.status(401).json({ message: 'Invalid authentication token.' });
            // বার্তা পাঠাচ্ছে যে টোকেনটি অবৈধ
        }

        // রিকোয়েস্ট অবজেক্টে ব্যবহারকারী যোগ করছি
        req.user = user;
        // রিকোয়েস্ট অবজেক্টে ব্যবহারকারী সংরক্ষণ করছি যাতে পরবর্তী মিডলওয়্যার বা রাউট হ্যান্ডলারে ব্যবহার করা যায়

        // পরবর্তী মিডলওয়্যার বা রাউট হ্যান্ডলার এ যেতে বলছি
        next();
        // এই ফাংশনটি পরবর্তী ফাংশনে পাস করে দিয়ে রিকোয়েস্ট প্রসেস করতে সাহায্য করে
    } catch (err) {
        // যদি কোনো ত্রুটি ঘটে, তাহলে 403 (Forbidden) রেসপন্স দিবো
        return res.status(403).json({ message: 'Token is invalid or expired.', error: err.message });
        // বার্তা পাঠাচ্ছে যে টোকেনটি অবৈধ অথবা মেয়াদ উত্তীর্ণ
    }
};

// মিডলওয়্যার এক্সপোর্ট করছি যাতে অন্যান্য ফাইল থেকে ব্যবহার করা যায়
module.exports = authenticateJWT;
