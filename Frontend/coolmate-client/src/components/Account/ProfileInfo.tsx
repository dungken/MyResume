import React from 'react';
import { ProgressBar, Button } from 'react-bootstrap';

const ProfileInfo: React.FC = () => {
    return (
        <div className="p-3 bg-light rounded mb-4">
            <h2 className="h5">Hi, Hà Văn Dũng</h2>
            <p className="text-primary font-weight-bold">MỚI</p>
            <p>Chi tiêu thêm 500.000đ để lên hạng <strong>BẠC</strong></p>

            {/* Progress bar with levels */}
            <ProgressBar className="my-3">
                <ProgressBar now={20} label="MỚI" />
                <ProgressBar variant="info" now={30} label="BẠC" />
                <ProgressBar variant="warning" now={50} label="VÀNG" />
                <ProgressBar variant="dark" now={100} label="BẠCH KIM" />
            </ProgressBar>

            <Button variant="dark" className="mb-2">CoolClub Rewards Hub</Button>
            <p>Bạn đang có <strong>0 CoolCash</strong></p>
        </div>
    );
};

export default ProfileInfo;
