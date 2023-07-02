import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import './style.scss';

const OCRResult = () => {
    const navigate = useNavigate();
    const { document } = useSelector((state) => ({ ...state.document }));
    const handleNewOCR = () => {
        navigate('/');
    }
    const handleEditDocument = () => {
        navigate(`/edit?id=${document.id}`);
    }

    return (
        <div className="component">
            <Result
                status="success"
                title="OCR complete"
                subTitle="Your document has been saved to the database, you can edit your document or OCR new one"
                extra={[
                    <Button onClick={handleEditDocument}>Edit document</Button>,
                    <Button onClick = {handleNewOCR}>OCR new PDF</Button>,
                ]}
            />
        </div>
    )
}

export default OCRResult;