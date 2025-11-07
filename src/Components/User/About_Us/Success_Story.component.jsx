import Story_Card from "./common/Story_Card.component";

const Success_Story = () => {
  return (
    <>
      <div className="flex flex-col isolate_container  space-y-16">
        <div className="flex flex-col  justify-center items-center">
          <h2 className="subheading1 font-semibold text-primary uppercase">
            A story of success with some numbers
          </h2>
        </div>

        <div className="flex flex-col ">
          <div className="flex flex-wrap justify-center items-center gap-16">
            <Story_Card
              number={1994}
              postfix={``}
              data={"Year of foundation"}
            />
            <Story_Card
              number={10}
              postfix={`k+`}
              data={"Products in the catalog"}
            />
            <Story_Card number={150} postfix={``} data={"Patents filed"} />
            <Story_Card
              number={50 + ""}
              postfix={`km²`}
              data={"Of warehouse space"}
            />
            <Story_Card
              number={120}
              postfix={``}
              data={"Countries form our export market"}
            />
            <Story_Card number={10} postfix={``} data={"Foreign branches"} />
            <Story_Card
              number={2}
              postfix={"Y"}
              data={"Average length of service of our staff"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Success_Story;
