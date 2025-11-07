// Horizontal Divider
const DividerHorizontal = () => {
    return (
      <hr
        style={{
          borderTop: "1px solid lightgrey",
          width: "100%",
        }}
      />
    );
  };
  // Vertical Divider
  const DividerVerticalNav = () => {
    return (
      <div
        style={{
          borderLeft: "1px solid lightgrey",
          height: "30px", // Make it full height of the parent
          margin: "0 10px", // Optional margin for spacing
        }}
      />
    );
  };

  // Vertical Divider
  const DividerVertical = () => {
    return (
      <div
        style={{
          borderLeft: "1px solid lightgrey",
          height: "80%", // Make it full height of the parent
          margin: "0 10px", // Optional margin for spacing
        }}
      />
    );
  };
  
  
  export { DividerHorizontal, DividerVertical,DividerVerticalNav };
  