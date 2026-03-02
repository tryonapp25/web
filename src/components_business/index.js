export const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#FFA500"; // Orange for pending
      case "CONFIRMED":
        return "#3b82f6"; // Green for completed
      case "REJECTED":
        return "#FF0000";
      case "PREPARING":
        return "#0000FF";
      case "READY":
        return "#16a34a";
      case "COMPLETED":
        return "#808080";
      case "CANCELLED":
        return "#FF0000";
      default:
        return "#808080"; // Gray for other statuses
    }
  };