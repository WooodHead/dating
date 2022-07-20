import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { userProfile } from "store/user/profile";
import Button from "components/Button";

function PremiumPlug() {
    const router = useRouter();
    const dispatch = useDispatch();
    const isPremiumPopupActive = useSelector(userProfile.selectors.isPremiumPopupActive);

    const handleBuySubscription = () => {
        router.push('/account/subscription');
    };

    return (
        <section className="premium-plug-container">
            <div className="d-flex flex-column align-items-center">
                <span className="text-semibold title-xs">If you want to see the full list buy a Premium subscription</span>
                <div className="choose-plan-btn-container">
                    <Button
                        type="button"
                        onClick={handleBuySubscription}
                        fullWidth
                    >Choose plan</Button>
                </div>
            </div>
            <div className="background-block"></div>
        </section>
    )
}

export default PremiumPlug