import React from "react";

export default function renderTextWithMentions(text) {
    return text.split(/([@#]\w+)/g).map((part, index) => {
        if (part.startsWith("@") || part.startsWith("#")) {
            return (
                <span key={index} className="text-blue-600">
                    {part}
                </span>
            );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};