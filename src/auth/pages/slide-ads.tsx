import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRef } from "react";
const data = [
    {
        id: 1,
        img: 'https://vacom.com.vn//uploads/1/vacom/phanmemketoan.jpg',
        href: 'https://vacom.com.vn/phan-mem-ke-toan-vacom-online',
        title: 'Phần mềm kế toán online VACOM',
        message: 'Được phát triển trên nền tảng web (web-based), cho phép truy cập và làm việc mọi lúc, mọi nơi trên nhiều thiết bị có kết nối internet như máy tính, điện thoại,ipad..'
    },
    {
        id: 2,
        img: 'https://vacom.com.vn//uploads/1/vacom/hoadondientu-1.png',
        href: 'https://vacom.com.vn/phan-mem-hoa-don-dien-tu-m-invoice',
        title: 'Phần mềm hóa đơn điện tử',
        message: 'Giải pháp Hóa đơn điện tử và Hóa đơn xác thực cho gần 20.000 Doanh nghiệp lớn thuộc mọi ngành nghề Sản xuất, Thương mại, Dịch vụ, Nhà hàng, Bệnh viện, Trường học...'
    },
    {
        id: 3,
        img: 'https://vacom.com.vn//uploads/1/vacom/phanmemketoan.jpg',
        href: 'https://vacom.com.vn/phan-mem-ke-toan-ho-kinh-doanh',
        title: 'Phần mềm kế toán Hộ Kinh doanh(VACOM HKD)',
        message: 'Lập và lưu trữ chứng từ kế toán dưới dạng điện tử giúp thực hiện dễ dàng.'
    },
    {
        id: 4,
        img: 'https://vacom.com.vn//uploads/1/vacom/quanlynhansu.jpg',
        href: 'https://vacom.com.vn/phan-mem-quan-ly-nhan-su-tien-luong',
        title: 'Phần mềm quản lý nhân sự - tiền lương',
        message: 'Giúp doanh nghiệp thực hiện các nghiệp vụ Quản trị nhân sự (Quản trị nguồn nhân lực) như: Hoạch định nguồn nhân lực, Tuyển dụng,hồ sơ,hợp đồng lao động,đào tạo ...'
    },
    {
        id: 5,
        img: 'https://vacom.com.vn//uploads/1/vacom/thuhocphi.png',
        href: 'https://vacom.com.vn/phan-mem-quan-ly-thu-hoc-phi',
        title: 'Phần mềm quản lý thu học phí',
        message: 'Giải pháp quản lý thu học phí trong các hệ thống trường học hiệu quả, an toàn và nhanh tróng'
    },
    {
        id: 6,
        img: 'https://vacom.com.vn//uploads/1/vacom/quanlyvanban.png',
        href: 'https://vacom.com.vn/phan-mem-quan-ly-van-thu-van-ban',
        title: 'Phần mềm quản lý văn bản',
        message: 'Giải pháp quản lý thu học phí trong các hệ thống trường học hiệu quả, an toàn và nhanh tróng'
    }
];

export function SlideAds() {
    return (
        <div className="w-full max-w-2xl">
            <div className="flex justify-end mb-4 pr-4 !static custom-pagination"></div>
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{
                    // el: ".swiper-pagination",
                    el: ".custom-pagination",
                    clickable: true,
                    bulletClass:
                        "inline-block w-2.5 h-2.5 bg-gray-400 rounded-full mx-1 cursor-pointer",
                    bulletActiveClass: "bg-primary",
                }}
                autoplay={{ delay: 5000 }}
                loop={true}
                className="rounded-lg shadow bg-card p-6"
            >
                {data.map(item => {
                    return (
                        <SwiperSlide key={item.id}>
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 bg-card rounded-xl">
                                    <div className="flex justify-center">
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="max-h-60 rounded-xl object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-muted-foreground">
                                            {item.message}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}
