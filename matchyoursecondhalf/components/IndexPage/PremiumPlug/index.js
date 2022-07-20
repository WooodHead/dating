import { useRouter } from "next/router";
import Button from "components/Button";

function PremiumPlug() {
    const router = useRouter();

    const handleBuySubscription = () => {
        router.push('/account/subscription');
    };

    return (
        <section className="premium-plug-container">
            <div className="d-flex flex-column align-items-center">
                <span className="text-semibold title-xs">If you want to see the full list buy a Premium subscription</span>
                <div className="choose-plan-btn-container">
                    <Button
                        text="Choose plan"
                        type="button"
                        onClick={handleBuySubscription}
                        fullWidth
                        dark
                    />
                </div>
            </div>
            <div className="background-block" />
        </section>
    )
}

export default PremiumPlug