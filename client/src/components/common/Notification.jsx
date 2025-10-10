import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, Badge, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import UserAvatar from "./UserAvatar";

const Notification = ({ title, message, onClose }) => {
  console.log("message :", message);
  console.log("title :", title);
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const vatchitSvg = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4A90E2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"></path>
    </svg>
  );
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-5 right-5 z-50"
        style={{
          position: "fixed", // <-- must be fixed
          bottom: 24, // distance from bottom
          right: 24, // distance from right
          zIndex: 9999, // on top of other content
          cursor: "pointer",
        }}
      >
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            boxShadow: 5,
            borderRadius: 3,
            width: 300,
            cursor: "pointer",
            "&:hover": { boxShadow: 8 },
          }}
          onClick={onClose}
        >
          <StyledBadge badgeContent={vatchitSvg} color="grey.dark">
            <UserAvatar name={title} size={"30px"} />
          </StyledBadge>

          <CardContent sx={{ p: 0 }}>
            <Typography variant="caption" color="text.secondary">
              {"VatChit"}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {message}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
