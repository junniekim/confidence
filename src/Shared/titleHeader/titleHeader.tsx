import React from "react";
import "./titleHeader.css";
interface TitleHeaderProps {
  title: string;
}
const TitleHeader: React.FC<TitleHeaderProps> = ({ title }) => {
  return (
    <div className="row">
      <h1 className="text-center mt-3 mb-4 col-12 title-header">{title}</h1>
    </div>
  );
};
export default TitleHeader;
