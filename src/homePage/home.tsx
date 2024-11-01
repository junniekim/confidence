import TitleHeader from "../Shared/titleHeader/titleHeader";
import sample from "../assets/sample.jpeg";
import Entry from "./entry";
const HomePage = () => {
  return (
    <div className="row">
      <TitleHeader title=" 🏋️‍♂️CONFIDENCE🏋️‍♀️"></TitleHeader>
      <Entry
        header="🤝 Meet Confidence"
        text={[
          "Are you tired of the hassle of carrying pen and paper at gym to log your workout? Say goodbye to the old-fashioned methods and embrace the future of fitness tracking with Confidence! ",
          "With Confidence, you can log your progress with just a few touches, eliminating the need for pen and paper and allowing you to focus solely on crushing your workouts. Check out the features below!",
        ]}
        src={sample}
        alt={"sample"}
      ></Entry>
      <Entry
        header="📝 Workout Tracking/Reflection"
        text={[
          "Log workouts, including sets, reps, and intensity, with just a few taps.",
          "But it doesn't stop there – our unique diary feature allows you to post workout summaries and attach a photo, providing a visual record of your progress and a space for reflection. Stay motivated and achieve your fitness goals faster with our all-in-one solution.",
        ]}
        src={sample}
        alt={"sample"}
      ></Entry>
    </div>
  );
};

export default HomePage;
